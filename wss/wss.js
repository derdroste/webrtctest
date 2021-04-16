const WebSocketServer = ({wss, WebSocket}) => {
    wss.on('connection', (ws, req) => {
        ws.upgradeReq = req;
        console.log(`Client connected...`);

        ws.on('message', message => {
            const data = JSON.parse(message);
            ws.id = data.roomId;

            switch (data.message) {
                case 'join-room':
                    broadcastToRooms({wss, ws, WebSocket, message: 'user-connected', userId: data.userId});
                    break;
            }
        });
    })
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
