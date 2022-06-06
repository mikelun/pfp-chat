import { io } from "socket.io-client";

export function startSocket() {
    const port = process.env.PORT || 3000;
    const site = '137.184.233.127/'
    const connectLink = site == 'localhost' ? `ws://localhost:${port}` : `ws://${site}`;
    
    const socket = io(connectLink, { transports: ['websocket']});

    console.log(connectLink);
    return socket;
}