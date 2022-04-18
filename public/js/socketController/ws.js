export const connect = async () => {

    // Initialize socket
    // will not use tls if the connection is not made over https
    const protocol = window.location.protocol.includes('https') ? 'wss' : 'ws'
    const ws = new WebSocket(`${protocol}://${location.host}`);

    const socket = {
        id: null,
        events: [],
    }

    socket.emit = (event, ...data) => {
        console.log('emit', event, ...data);
        ws.send(JSON.stringify({ event, data }));
    }

    socket.on = function (event, callback) {
        console.log('on', event);
        socket.events.push({ event, callback });
    }

    await new Promise((resolve, reject) => {
        ws.onopen = () => {
            console.log('Connected to server');
        }

        ws.onmessage = (_event) => {
            const data = JSON.parse(_event.data);

            if (data.id) {
                socket.id = data.id;
                console.log('received id', data.id);
                resolve(data.id);
            } else {
                console.error('received unknown data instead of id', data);
                reject('received unknown data instead of id');
            }

        }
    });

    ws.onmessage = (_event) => {
        const data = JSON.parse(_event.data);

        if (!data) { return }

        if (!socket.id) {
            console.error('received event before id', data.event, data.data);
            return;
        }

        console.log('received event', data.event, ...data.data);

        socket.events.forEach(({ event: _event, callback: _callback }) => {
            if (data.event === _event) {
                _callback(...data.data);
            }
        });
    }

    return socket
}


export default connect;
