<script>
    import {onMount} from 'svelte';
    import { videoGrid } from '../store/stores.js';
    let grid;
    onMount(() => {
        videoGrid.set(grid);
    })
</script>

<div class="flex videogrid" bind:this={grid}>

</div>

<style>
    .videogrid {
        flex-flow: column;
        flex-wrap: wrap;
    }
</style>
