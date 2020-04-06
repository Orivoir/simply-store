const encodeStringBase64 = require('btoa') ;

class SimplyStore {

    constructor( expires ) {

        this.expires = expires ;
        this.storeID = null ;
        this.storage = {} ;

        this.clean() ;
    }

    clean() {

        clearInterval( this.storeID ) ;

        this.storeID = setInterval(() => {

            Object
                .keys( this.storage )
                .forEach( userAgent => {

                    const lastUpdateAt = this.storage[ userAgent ].lastUpdateAt ;

                    const timeout = ( Date.now() - lastUpdateAt ) ;

                    if( timeout >= this.expires ) {
                        // this data session have expires
                        delete this.storage[ userAgent ] ;
                    }

                } )
            ;

        },  this.expires );
    }

    save( req ) {

        return () => {

            const userAgent = req.headers['user-agent'] ;

            this.storage[ userAgent ].data = req.session ;

            this.storage[ userAgent ].lastUpdateAt = Date.now() ;
        } ;
    }

    onRequest( req ) {

        const userAgent = req.headers['user-agent'] ;

        if( !!this.storage[ userAgent ] ) {

            req.session = this.storage[ userAgent ].data ;

        } else {

            this.storage[ userAgent ] = {

                data: {} ,
                lastUpdateAt: Date.now() ,
                id: encodeStringBase64( ( Math.random().toString().replace('.','') + Date.now() ) )
            } ;

            req.session = {} ;
        }

        return this.storage[ userAgent ] ;
    }

    get expires() {
        return this._expires ;
    }

    set expires( expires ) {

        this._expires = ( typeof expires === "number" ) ? parseInt( expires ): 1e3*60*60 ;
    }

} ;

module.exports = function( expires ) {

    const store = new SimplyStore( expires ) ;

    return function( req, _, next ) {

        const storage = store.onRequest( req ) ;

        req.session = storage.data ;
        req.sessionID = storage.id ;

        req.session.save = store.save( req ) ;

        if( next instanceof Function ) {

            next() ;
        }
    } ;

} ;
