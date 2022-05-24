// make dotenv available
const dotenv = require('dotenv');
dotenv.config();


// Make app with express
const express = require('express');
const app = express();
require('./routes.js')(app);

const session = require('express-session');

const {parser} = require('socket.io-msgpack-parser');

// CONFIGURATION ===============================================================

var port = process.env.PORT || 3000; // set our port

////////////////////////////////////////////////////////////////////////////////


// get SECRET_SECCION from .env 
const SECRET_SESSION = process.env.SECRET_SESSION;

const sessionMiddleware = session({
    secret: SECRET_SESSION,
    resave: false,
    saveUninitialized: true
});


app.use(sessionMiddleware);

// build server
const server = require('http').Server(app);

const io = require('socket.io')(server, {
    wsEngine: require("eiows").Server,
    allowRequest: (req, callback) => {
        // with HTTP long-polling, we have access to the HTTP response here, but this is not
        // the case with WebSocket, so we provide a dummy response object
        const fakeRes = {
            getHeader() {
                return [];
            },
            setHeader(key, values) {
                req.cookieHolder = values[0];
            },
            writeHead() { },
        };
        sessionMiddleware(req, fakeRes, () => {
            if (req.session) {
                // trigger the setHeader() above
                fakeRes.writeHead();
                // manually save the session (normally triggered by res.end())
                req.session.save();
            }
            callback(null, true);
        });
    },
});


require('./socketcontroller.js')(io);

require('./supabase/supabase.js').initializeSupabase();


server.listen(port, function () {
    console.log('listening on *:' + port);
});