const express = require('express');
const app = express();
const { createServer } = require('http');
const WebSocket = require('ws');
const server = createServer(app);
const wss = new WebSocket.Server({ server });
const {WebSocketServer} = require('./wss/wss');
const port = 8080;

app.use(express.static('public'));

WebSocketServer({wss, WebSocket});

server.listen(port, () => {
    console.log(`Server listening on Port: ${port}...`);
});
