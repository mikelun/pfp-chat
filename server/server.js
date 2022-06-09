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

// var Twitter = require('twitter');

// var client = new Twitter({
//     consumer_key: 'ddXsYRqDrHzISCtD9RO8UyqGJ',
//     consumer_secret: 'S8mTc7Cf2eHZCW8YhyFx0iJi21XJja4rT60IlGpbJrZBC6zJpe',
//     bearer_token: 'AAAAAAAAAAAAAAAAAAAAAN5qdAEAAAAABEmJU%2FH%2F%2BE65X4%2FFXFGgTdjGzSI%3D4okHW1oJOO4K0jDGgpBO1FqtDzQxfgwY9S6FX0dKXiM37l3nJO'
// });

// client.get('/2/tweets/1531112342850781184', function(error, tweets, response) {
//     console.log(tweets, error);
//  });

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