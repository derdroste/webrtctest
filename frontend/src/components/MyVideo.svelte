<script>
    import {onMount} from 'svelte';
    import { myVideo } from '../store/stores.js';
    let video;
    onMount(() => {
        myVideo.set(video);
    })
</script>

<video class="fixed bottom-28 right-0 z-10" bind:this={video}></video>

<style>
    video {
        transform: scaleX(-1);
        width: 25vw;
        height: 25vh;
        object-fit: cover;
    }
</style>
