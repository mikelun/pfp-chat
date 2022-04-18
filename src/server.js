
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

const io = require('socket.io')(server);

const { onConnect, ioConfig } = require('./socketcontroller.js');

const buildSocket = (wss, ws) => {

    // generate random id
    const id = Math.random().toString(36).substring(7);

    ws.send(JSON.stringify({ id }));

    const socket = {
        id,
        emit: (event, ...data) => {
            console.log('emit', event, ...data);
            ws.send(JSON.stringify({ event, data }));
        },
        on: (event, callback) => {
            console.log('on', event);

            ws.on('message', (_event) => {
                const data = JSON.parse(_event);

                console.log('received event', data.event, ...data.data);

                if (data.event === event) {
                    callback(...data.data);
                }

            });
        },
        broadcast: {
            emit: (event, ...data) => {
                console.log('broadcast emit', event, ...data)

                wss.clients.forEach(client => {
                    if (client === ws) {
                        // skip broadcast to yourself
                        return
                    }

                    client.send(JSON.stringify({ event, data }));
                });
            }
        }
    };

    return socket;
}

wss.on('connection', (ws) => {
    const socket = buildSocket(wss, ws);

    onConnect(socket);
});

server.listen(port, function(){
    console.log('listening on *:' + port);
});
