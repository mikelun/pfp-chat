
// Make app with express
const express = require('express');
const app = express();
require('./routes.js')(app);



// CONFIGURATION ===============================================================

var port = process.env.PORT || 8080; // set our port

////////////////////////////////////////////////////////////////////////////////



// build server
const server = require('http').Server(app);
const WebSocket = require('ws');

const wss = new WebSocket.Server({ server });

const { onConnect, buildSocket } = require('./socketcontroller.js');

wss.on('connection', (ws) => {
    const socket = buildSocket(wss, ws);

    onConnect(socket);
});

server.listen(port, function(){
    console.log('listening on *:' + port);
});
