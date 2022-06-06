export const connect = async (sec = 1, isReconnect = false) => {

    if (
        window.connection &&
        window.connection.readyState === window.connection.OPEN
    ) { return console.log('ws already running...') }

    // Initialize socket
    // will not use tls if the connection is not made over https
    const protocol = window.location.protocol.includes('https') ? 'wss' : 'ws'

    // if location is localhost, connect to localhost:8080
    // otherwise connect to the same domain
    const host = window.location.hostname === 'localhost' ? 'localhost:8080' : window.location.host

    const ws = new WebSocket(`${protocol}://${host}`);

    const socket = !!window.socket ? window.socket : {
        id: null,
        events: [],
    }

    window.socket = socket;
    window.socket.id = null;

    const reconnect = () => {
        console.log(`Reconnecting to server in ${sec} seconds...`)

        setTimeout(() => {
            const cappedTimeout = Math.min(4, sec * 2)
            connect(cappedTimeout, true)
        }, sec * 1000)
    }

    socket.emit = (event, ...data) => {
        console.log('emit', event, ...data);
        ws.send(JSON.stringify({ event, data }));
    }

    socket.on = function (event, callback) {
        console.log('on', event);
        socket.events.push({ event, callback });
    }

    socket.off = function (event) {
        console.log('off', event);
        socket.events = socket.events.filter(e => e.event !== event);
    }

    socket.forceEvent = async function (event, ...data) {
        console.log('forceEvent', event, ...data);

        const hasEvent = socket.events.find(e => e.event === event);

        if (hasEvent) {
            hasEvent.callback(...data);
        } else {
            console.log('No event found for', event);
        }
    }

    socket.ws = ws

    ws.onclose = async () => {
        console.log('ws.onclose', socket.id, socket);

        try {
            if (!!socket.id) {
                socket.forceEvent('disconnect');
            }
        } finally {
            // try to reconnect
            await new Promise(resolve => setTimeout(resolve, 1000));
            reconnect();
        }
    }

    ws.onerror = (error) => {
        console.error('socket error', error)
        ws.close()
    }

    await new Promise(resolve => {
        ws.onopen = () => {
            console.log('connected to server', ws.url);
            resolve();
        }
    })

    new Promise((resolve, reject) => {

        ws.onmessage = (_event) => {
            const data = JSON.parse(_event.data);

            if (data.id) {
                socket.id = data.id;
                //console.log('received id', data.id);
                resolve(data.id);

                if (isReconnect) {
                    socket.forceEvent('reconnect', data.id);
                }
            } else {
                console.error('received unknown data instead of id', data);
                reject('received unknown data instead of id');
            }

        }

    }).then(() => {

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

    }).catch(err => {
        console.error('error connecting to server', err);

        reconnect();
    })

    return socket
}


export default connect;
