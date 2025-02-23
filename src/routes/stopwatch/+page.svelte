<script lang="js">
    //I think this is much better than my alarm clock, I will likely update it with this type of logic in the coming commits

    import { FormatNumberString, GetCookie, SetCookie } from '$lib/index.js';
    import '$lib/common.css'

    let seconds = $state(0);
    let minutes = $state(0);
    let hours = $state(0);
    let milliseconds = $state(0);

    let elapsedTime = $state(0);
    let prevElapsedTime = $state(0);

    let displayHours = $derived(FormatNumberString(hours));
    let displayMinutes = $derived(FormatNumberString(minutes));
    let displaySeconds = $derived(FormatNumberString(seconds));
    let displayMilliseconds = $derived(FormatNumberString(milliseconds, 3));

    let savedTimes = $state([]);

    let stopwatchRunning = $state(false);
    let intervalId = $state();
    let startTime = $state();

    function startStopwatch(e) {
        if (e) {
            e.preventDefault();
        }

        if (!stopwatchRunning) {
            stopwatchRunning = true;
            startTime = performance.now();
            intervalId = requestAnimationFrame(countStopwatch);
        }
    }

    function stopStopwatch(e) {
        if (e) {
            e.preventDefault();
        }

        stopwatchRunning = false;
        cancelAnimationFrame(intervalId);

        if (milliseconds >= 0) {
            prevElapsedTime = elapsedTime;
        }
    }

    function clearStopwatch(e) {
        if (e) {
            e.preventDefault();
        }

        stopStopwatch();

        prevElapsedTime = 0;
        elapsedTime = 0;
        milliseconds = 0;
        seconds = 0;
        minutes = 0;
        hours = 0;
    }

    function saveTime(e) {
        e.preventDefault();

        savedTimes.push({
            displayHours: displayHours,
            displayMinutes: displayMinutes,
            displaySeconds: displaySeconds,
            displayMilliseconds: displayMilliseconds,
        });

        clearStopwatch();
    }

    function countStopwatch() {
        if (stopwatchRunning) {
            elapsedTime = (performance.now() - startTime) + prevElapsedTime;

            hours = Math.floor(elapsedTime / 3600000);
            minutes = Math.floor((elapsedTime % 3600000) / 60000);
            seconds = Math.floor((elapsedTime % 60000) / 1000);
            milliseconds = Math.floor(elapsedTime % 1000);

            intervalId = requestAnimationFrame(countStopwatch);
        }
    }

    function deleteTime(time) {
        savedTimes = savedTimes.filter(findTime => findTime !== time);
    }

</script>
<style lang="css">
    .stopwatch {
        position: relative;
        display: grid;

        min-height: 100dvh;
        width: 100dvw;
        max-width: 100dvw;

        place-items: center;
    }

    .time {
        color: whitesmoke;
        text-align: center;
        z-index: 5;
    }

    .time h1 {
        font-size: 6rem;
        margin-top: 1rem;
        margin-bottom: 1rem;
    }

    .time-controls {
        position: relative;
        display: flex;
        flex-direction: column;

        height: fit-content;
        width: 95dvw;

        justify-content: center;
        align-items: center;
        gap: 1rem;
        z-index: 5;
    }

    .time-btns {
        position: relative;
        display: flex;
        flex-direction: row;

        height: fit-content;
        width: 100%;

        justify-content: center;
        gap: 1rem;
    }

    .start-stop-btn, .save-btn {
        background-color: var(--color-accent);
    }

    .clear-btn {
        background-color: var(--color-foreground);
        color: whitesmoke;
    }

    .hidden {
        opacity: 0;
        visibility: hidden;
    }

    .times-comp-container {
        position: relative;
        display: flex;
        flex-wrap: wrap;

        height: fit-content;
        width: 100%;

        justify-content: space-around;
        align-items: center;
        gap: 1rem;
    }

    .time-comp {
        position: relative;
        display: flex;
        flex-direction: column;

        height: 10dvh;
        width: 25rem;

        justify-content: center;
        align-items: center;

        border: var(--color-foreground) dashed 0.1rem;
        background-color: var(--color-background);
        margin-top: 2rem;
        border-radius: 12px;
    }

    .time-comp span {
        color: var(--color-accent);
    }

    .delete {
        position: absolute;

        height: 100%;
        width: 100%;

        color: lightcoral;
        font-size: 3rem;

        visibility: hidden;
        opacity: 0;
        background-color: rgba(255, 255, 255, 0.3);
        transition: 0.3s ease;
    }

    .time-comp:hover span {
        opacity: 0.3;
    }

    .time-comp:hover p {
        opacity: 0.3;
    }

    .time-comp:hover .delete {
        opacity: 1;
        visibility: visible;
    }

</style>
<section class="stopwatch">
    <div class="shelf"></div>
    <div class="time">
        <h1>{displayHours}:{displayMinutes}:{displaySeconds}:{displayMilliseconds}</h1>
        <button class="save-btn" class:hidden={elapsedTime === 0 && !stopwatchRunning} onclick={saveTime}>Save</button>
    </div>
    <div class="time-controls">
        <div class="time-btns">
            <button class="clear-btn" onclick={clearStopwatch}>Clear</button>
            <button class="start-stop-btn" onclick={stopwatchRunning ? stopStopwatch : startStopwatch}>{stopwatchRunning ? 'Stop' : 'Start'}</button>
        </div>
        <div class="times-comp-container">
            {#each savedTimes as time}
                <div class="time-comp">
                    <span>{time.displayHours}:{time.displayMinutes}:{time.displaySeconds}:{time.displayMilliseconds}</span>
                    <button class="delete" onclick={() => deleteTime(time)}>&#10005;</button>
                </div>
            {/each}
        </div>
    </div>
</section>