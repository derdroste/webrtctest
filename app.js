const express = require('express');
const app = express();
const { createServer } = require('http');
const WebSocket = require('ws');
const server = createServer(app);
const wss = new WebSocket.Server({ server });
const {WebSocketServer} = require('./wss/wss');
const rooms = require('./routes/rooms');
const port = 8080;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/', rooms);

WebSocketServer({wss, WebSocket});

server.listen(port, () => {
    console.log(`Server listening on Port: ${port}...`);
});
