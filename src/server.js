
// Make app with express
var express = require('express');
var app = express();
require('./routes')(app);



// CONFIGURATION ===============================================================

var port = process.env.PORT || 3000; // set our port

////////////////////////////////////////////////////////////////////////////////



// build server
const server = require('http').Server(app);   
const io = require('socket.io')(server);
require('./socketController')(io)



server.listen(port, function(){
    console.log('listening on *:' + port);
});