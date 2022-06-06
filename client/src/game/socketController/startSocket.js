import { io } from "socket.io-client";

export function startSocket() {
    const port = process.env.PORT || 3000;
    const site = window.location.hostname;
    const connectLink = site == 'localhost' ? `ws://localhost:${port}` : `wss://${site}`;
    
    const socket = io(connectLink, { transports: ['websocket']});

    return socket;
}