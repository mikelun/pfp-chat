import { io } from "socket.io-client";

export function initializeSocket() {
    const port = process.env.PORT || 3001;
    const site = window.location.hostname;
    const connectLink = site == 'localhost' ? `ws://localhost:${port}` : `wss://${site}`;    
    const socket = io(connectLink, { transports: ['websocket']});
    return socket;
}