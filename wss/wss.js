const WebSocketServer = wss => {
    wss.on('connection', ws => {
        console.log(`Client connected...`);

        ws.on('message', data => {
            console.log(data);

            wss.clients.forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(data);
                }
            });
        });
    })
};

module.exports = {WebSocketServer};
