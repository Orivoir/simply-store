# [Simply Store](https://www.npmjs.com/package/simply-store)

> **Simply Store** is a session handler with expires after custom delay , **easy use**

## MemoryStore is **not** shared with browser

Client is recognized with **user-agent** from *headers request* ,
each **user-agent** is a new client

### npm install simply-store --save
### yarn add simply-store

from **app.js**:
```javascript

// 1 Hours
const expires = 1e3 * 60 * 60 ;

// expires default value 1 Hours
const simplystore = require('simply-store')( expires ) ;
```

## Usage with **[Express](https://www.npmjs.com/package/express)** as *middleware*:

- npm install express --save

from **app.js**:
```javascript
const express = require('express') ;
const app = express() ;
const server = require('http').Server( app ) ;

app.use( simplystore ) ;

app.get( '/' , (req,res) => {

    res.type('json') ;

    res.status( 200 ) ;

    if( !req.session.test ) {

        req.session.test = Math.random() ;

        req.session.save() ;
    }

    res.json( {

        test: req.session.test ,
        id: req.sessionID

    } ) ;

}  ) ;

server.listen( process.env.PORT || 3000 , () => {

    console.log('HTTP server running ...') ;
} ) ;
```

## Standalone usage:

from **app.js**:
```javascript
const server = require('http').Server( function( req, res ) {


    simplystore( req, res ) ;

    if( !req.session.test ) {

        req.session.test = Math.random() ;

        req.session.save() ;
    }

    res.end(`test: ${req.session.test}\nid: ${req.sessionID}`) ;

} ) ;


server.listen( process.env.PORT || 3000 , () => {

    console.log('HTTP server running ...') ;
} ) ;
```


### npm install simply-store --save
### yarn add simply-store

