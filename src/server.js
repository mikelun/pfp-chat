// make dotenv available
const dotenv = require('dotenv');
dotenv.config();


// Make app with express
const express = require('express');
const app = express();
require('./routes.js')(app);

const session = require('express-session');



// CONFIGURATION ===============================================================

var port = process.env.PORT || 3000; // set our port

////////////////////////////////////////////////////////////////////////////////

const sessionMiddleware = session({
    secret: "changeit",
    resave: false,
    saveUninitialized: true
});


app.use(sessionMiddleware);

// build server
const server = require('http').Server(app);

const io = require('socket.io')(server, {
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