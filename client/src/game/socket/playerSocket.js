export function initializePlayerSocket(socket) {
    socket.on('currentPlayers', players => {
        console.log('currentPlayers', players);
    });

    
}