const videoGrid = document.querySelector('#video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;
const myPeer = new Peer();
const peers = {};

const ws = new WebSocket(`wss://${location.host}`);

myPeer.on('open', id => {
    ws.send(JSON.stringify({message: 'join-room', roomId: ROOM_ID, userId: id}));
});

navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
}).then(stream => {
    addVideoStream(myVideo, stream);

    myPeer.on('call', call => {
        call.answer(stream);

        const video = document.createElement('video');
        video.muted = true;
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream);
        })
    });

    ws.onmessage = (message) => {
        const data = JSON.parse(message.data);
        switch (data.message) {
            case 'user-connected':
                connectToNewUser(data.userId, stream);
                break;
        }
    }
})

const connectToNewUser = (userId, stream) => {
    const call = myPeer.call(userId, stream);
    const video = document.createElement('video');
    video.muted = true;
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream);
    });
    call.on('close', () => {
        video.remove();
    });

    peers[userId] = call;
}

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    });
    videoGrid.append(video);
}
