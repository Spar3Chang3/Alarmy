<script lang="js">
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import '$lib/common.css';
    import Fireflies from '$lib/Fireflies.svelte';

    const audioPath = '/index/shape-of-you.mp3';
    let audio = $state();

    let playMusic = $state(true);
    let canGoto = $state(false);

    function toClock(e) {
        e.preventDefault();

        if (canGoto) {
            goto('/clock');
        }
    }

    function toStopwatch(e) {
        e.preventDefault();

        if (canGoto) {
            goto('/stopwatch');
        }

    }

    function toTimer(e) {
        e.preventDefault();

        if (canGoto) {
            goto('/timer');
        }
    }

    function toggleMusic(e) {
        e.preventDefault();

        if (playMusic) {
            playMusic = false;
            audio.pause();
        } else {
            playMusic = true;
            audio.play();
        }
    }

    onMount(() => {
        audio = new Audio(audioPath);

        if (playMusic) {
            audio.volume = 0.25;
            audio.loop = true;
            audio.play();
        }

        canGoto = true;

        return () => {
            audio.pause();
            audio = null;
        }
    });
</script>
<style lang="css">
    .index {
        position: relative;
        display: flex;
        flex-direction: column;

        min-height: 100dvh;
        width: 100dvw;
        max-width: 100dvw;

        justify-content: center;
        align-items: center;
        gap: 2rem;
    }

    .link {
        font-size: 2rem;

        width: 20rem;

        z-index: 5;
    }

    .music-control {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);

        z-index: 5;
    }
</style>
<section class="index">
    <div class="shelf">
        <Fireflies showFireflies={true} />
    </div>
    <button class="link" onclick={toClock}>Alarm Clock</button>
    <button class="link" onclick={toStopwatch}>Stopwatch</button>
    <button class="link" onclick={toTimer}>Timer</button>

    <div class="music-control">
        <button onclick={toggleMusic} style="{playMusic ? 'color: black' : 'background-color: #2a2a2a; color: whitesmoke'};">{playMusic ? 'Pause Music' : 'Play Music'}</button>
    </div>
</section>