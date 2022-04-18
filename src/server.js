
// Make app with express
const express = require('express');
const app = express();
require('./routes.js')(app);



// CONFIGURATION ===============================================================

var port = process.env.PORT || 8080; // set our port

////////////////////////////////////////////////////////////////////////////////



// build server
const server = require('http').Server(app);
const io = require('socket.io')(server);
require('./socketcontroller.js')(io)



server.listen(port, function(){
    console.log('listening on *:' + port);
});