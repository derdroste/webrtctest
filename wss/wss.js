const WebSocketServer = ({wss, WebSocket}) => {
    wss.on('connection', (ws, req) => {
        ws.upgradeReq = req;
        console.log(`Client connected...`);

        ws.on('message', message => {
            const data = JSON.parse(message);
            ws.id = data.roomId;
            ws.isAlive = true;

            ws.on('pong', () => {
                ws.isAlive = true;
            });

            switch (data.message) {
                case 'join-room':
                    broadcastToRooms({
                        wss,
                        ws,
                        WebSocket,
                        message: 'user-connected',
                        userId: data.userId
                    });
                    break;
            }
            ws.on('close', () => {
                broadcastToRooms({
                    wss,
                    ws,
                    WebSocket,
                    message: 'user-disconnected',
                    userId: data.userId
                });
            });
        });
    });

    setInterval(() => {
        wss.clients.forEach(ws => {

            if (!ws.isAlive) return ws.terminate();

            ws.isAlive = false;
            ws.ping(null, false, true);
        });
    }, 10000);
};

const broadcastToRooms = ({wss, ws, WebSocket, message, userId}) => {
    wss.clients.forEach(client => {
        if (client.upgradeReq.url === ws.upgradeReq.url && client.id === ws.id) {
            if (client !== ws && client && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(
          {
                    message,
                    userId
                }));
            }
        }
    });
}

module.exports = {WebSocketServer};
