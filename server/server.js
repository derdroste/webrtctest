const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const {v4: uuidV4} = require('uuid');

app.set('view engine', 'ejs');
app.use(express.static('public'));

const Server = (port) => {
    app.get('/', ((req, res) => {
        res.redirect(`${uuidV4()}`);
    }));

    app.get('/:room', ((req, res) => {
        res.render('room', { roomId: req.params.room });
    }));

    server.listen(port, () => {
        console.log(`Server listening on Port: ${port}...`)
    });

    io.on('connection', socket => {
        socket.on('join-room', (roomId, userId) => {
            socket.join(roomId);
            socket.broadcast.to(roomId).emit('user-connected', userId);

            socket.on('disconnect', () => {
                socket.broadcast.to(roomId).emit('user-disconnected', userId);
            });
        });
    });
}

module.exports = Server;
