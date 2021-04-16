const express = require('express');
const app = express();
const { createServer } = require('http');
const WebSocket = require('ws');
const server = createServer(app);
const wss = new WebSocket.Server({ server });
const {WebSocketServer} = require('./wss/wss');
const lp = require('./routes/lp');
const rooms = require('./routes/rooms');
const port = 8080;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/', lp);
app.use('/rooms', rooms);

WebSocketServer({wss, WebSocket});

server.listen(port, () => {
    console.log(`Server listening on Port: ${port}...`);
});
