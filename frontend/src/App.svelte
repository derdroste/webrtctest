<script>
	import TopBar from './components/TopBar.svelte';
	import MyVideo from "./components/MyVideo.svelte";
	import {myVideo} from './store/stores.js';
	import {videoGrid} from './store/stores.js';
	import VideoGrid from "./components/VideoGrid.svelte";
	import BottomBar from "./components/BottomBar.svelte";

	let myVideo_value;
	let videoGrid_value;

	const unsubscribeMyVideo = myVideo.subscribe(value => {
		myVideo_value = value;
	});
	const unsubscribeVideoGrid = videoGrid.subscribe(value => {
		videoGrid_value = value;
	});

	const myPeer = new Peer();
	const peers = {};
	const ws = new WebSocket(`ws://${location.host}`);

	myPeer.on('open', id => {
		ws.send(JSON.stringify({
			message: 'join-room',
			roomId: ROOM_ID,
			userId: id,
		}));
	});

	navigator.mediaDevices.getUserMedia({
		video: true,
		audio: true,
	}).then(stream => {
		myVideo_value.muted = true;
		addVideoStream(myVideo_value, stream, true);

		myPeer.on('call', call => {
			call.answer(stream);

			const video = document.createElement('video');
			call.on('stream', userVideoStream => {
				addVideoStream(video, userVideoStream, false);
			})
		});

		ws.onmessage = (message) => {
			const data = JSON.parse(message.data);
			switch (data.message) {
				case 'user-connected':
					connectToNewUser(data.userId, stream);
					break;
				case 'user-disconnected':
					if (peers[data.userId]) peers[data.userId].close();
					break;
			}
		}
	})

	const connectToNewUser = (userId, stream) => {
		const call = myPeer.call(userId, stream);
		const video = document.createElement('video');
		call.on('stream', userVideoStream => {
			addVideoStream(video, userVideoStream, false);
		});
		call.on('close', () => {
			video.remove();
		});
		peers[userId] = call;
	}

	const addVideoStream = (video, stream, my) => {
		video.srcObject = stream;
		video.addEventListener('loadedmetadata', () => {
			video.play();
		});
		if (!my) {
			videoGrid_value.append(video);
		}
	}

</script>

<main class="bg-primary h-full w-full">
	<TopBar />
	<MyVideo />
	<VideoGrid />
	<BottomBar />
</main>

<style global lang="postcss">
	@tailwind base;
	@tailwind components;
	@tailwind utilities;

	body {
		padding: 65px 0 40px 0;
		font-family: 'Roboto', sans-serif;
	}
</style>
