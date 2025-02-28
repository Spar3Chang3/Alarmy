<script lang="js">
    import { onMount } from 'svelte';
    import { GetCookie, SetCookie } from '$lib/index.js';
    import '$lib/common.css';
    import Alert from '$lib/Alert.svelte';
    import CookiePrompt from '$lib/CookiePrompt.svelte';
    import Fireflies from '$lib/Fireflies.svelte';
    import TimePicker from '$lib/TimePicker.svelte';
    import Timer from '$lib/Timer.svelte';

    const cookieName = "TimerTimes";

    let allowCookies = $state(false);
    let allowCookiePrompt = $state(false);

    let timerSet = $state(false);

    let savedTimers = $state(new Map());
    let displaySavedTimers = $state([]);

    function deleteTimer(timerToDelete) {
        savedTimers.delete(timerToDelete.totalTimeMs);
    }

    onMount(() => {
        savedTimers.set((60 * 60000), {
           totalTimerMs: (60 * 60000),
        });

        displaySavedTimers = [...savedTimers.values()];
    });

</script>
<style lang="css">

    .timer {
        position: relative;
        display: grid;

        min-height: 100dvh;
        width: 100dvw;
        max-width: 100dvw;

        place-items: center;
    }

    .timer-comp-container {
        position: relative;
        display: flex;
        flex-wrap: wrap;

        height: fit-content;
        max-width: 90dvw;

        justify-content: space-around;

        z-index: 5;
    }

</style>
<section class="timer">
    <div class="shelf"></div>
    <div class="timer-comp-container">
        {#each displaySavedTimers as timer}
            <Timer totalTimeMs={60*1000} callback={deleteTimer}/>
        {/each}
    </div>
    <div class="new-timer-container">
        <TimePicker/>
    </div>
</section>