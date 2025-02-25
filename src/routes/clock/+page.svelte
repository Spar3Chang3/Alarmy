<script lang="js">
    //TODO: change lower text to use 12h, possibly implement timer, implement unobtrusive forced user interaction for sound

    import { onMount } from 'svelte';
    import { GetCookie, SetCookie, MakeNumberArray, FormatNumberString, GetCurrentDay, GetNextDay, IconLinks } from '$lib/index.js';
    import Fireflies from '$lib/Fireflies.svelte';
    import CookiePrompt from '$lib/CookiePrompt.svelte';
    import Alert from '$lib/Alert.svelte';
    import '$lib/common.css';

    const alarmSound = "/default/YOU-WOULD-NOT-BELIEVE-YOUR-EYES.mp3";
    const fireflyNum = MakeNumberArray(0, 50);
    const cookieName = "AlarmTimes";
    const apiUrl = 'http://worldtimeapi.org/api/ip';

    let allowCookies = $state(false);
    let showCookiePrompt = $state(false);

    let useApi = $state(true);

    let alarmAudio = $state(null);
    let animationFrame = $state(null);

    let startTime = $state(0);
    let apiTime = $state();

    let hours = $state(0);
    let minutes = $state(0);
    let seconds = $state(0);

    let amPm = $state('');
    let displayHours = $derived(get12Hr(hours));
    let displayMinutes = $derived(FormatNumberString(minutes));
    let displaySeconds = $derived(FormatNumberString(seconds));

    let currentMinuteTime = $derived(`${hours}:${minutes}`);
    let savedAlarms = $state(new Map());
    let displaySavedAlarms = $state({});
    let nextAlarm = $state({});
    let userAlarmChoice = $state();

    let alarmPlaying = $state(false);
    let alarmSet = $state(false);

    async function syncTime() {

        await fetch(apiUrl).then((res) => {
            return res.json();
        }).then((value) => {
            apiTime = new Date(value.datetime);
        }).then(() => {
            startTime = performance.now() + apiTime.getMilliseconds();

            hours = apiTime.getHours();
            minutes = apiTime.getMinutes();
            seconds = apiTime.getSeconds();
            setAmPm();
        });
    }

    function updateTimeFrame() {
        if (performance.now() - startTime >= 1000) {
            seconds++;
            startTime = performance.now();
        }

        if (seconds === 60) {
            seconds = 0;
            minutes++;
        }

        if (minutes === 60) {
            syncTime();
        }

        setAmPm();

        if (alarmSet) {
            if (currentMinuteTime === nextAlarm.full && !alarmPlaying) {
                playAlarm();
                alarmPlaying = true;

                calculateNextRings();
                getNextNearestTime();
            }
        }

        animationFrame = requestAnimationFrame(updateTimeFrame);
    }

    function setAmPm() {
        if (hours === 0) {
            amPm = 'AM';
        } else if (hours > 12) {
            amPm = 'PM';
        } else {
            amPm = 'AM';
        }
    }

    function getAmPm(hours) {
        if (hours === 0) {
            return 'AM';
        } else if (hours >= 12) {
            return 'PM';
        } else {
            return 'AM';
        }
    }

    function get12Hr(hours) {
        if (hours === 0) {
            return '12';
        } else if (hours > 12) {
            return FormatNumberString(hours % 12);
        } else {
            return FormatNumberString(hours);
        }
    }

    function calculateNextRings() {
        const currentFullMinutes = (hours * 60) + minutes;

        for (let key of [...savedAlarms.keys()]) {
            if (key <= currentFullMinutes) {
                savedAlarms.get(key).timestamp = GetNextDay();
            }
        }

        displaySavedAlarms = [...savedAlarms.values()];
    }

    function calculateNextRing(alarmHours, alarmMinutes) {
        const currentFullMinutes = (hours * 60) + minutes;

        const fullAlarmMinutes = (alarmHours * 60) + alarmMinutes;

        if (fullAlarmMinutes <= currentFullMinutes) {
            return GetNextDay();
        } else {
            return GetCurrentDay();
        }
    }

    function getNextNearestTime() {
        const currentFullMinutes = (hours * 60) + minutes;
        let min = 24 * 60; //max value of total hours to start

        for (let key of [...savedAlarms.keys()]) {
            if (key > currentFullMinutes) {
                if (key < min) {
                    min = key;
                }
            }
        }

        if (min === (24 * 60)) { //if it's still the same, just get the earliest alarm because all others have already been passed up for the day
            nextAlarm = savedAlarms.get(Math.min([...savedAlarms.keys()]));
        } else {
            nextAlarm = savedAlarms.get(min);
        }
    }

    function playAlarm() {
        alarmAudio.play().catch(() => {
            console.log('Autoplay blocked by browser');
            alarmAudio.play(); //Fallback if autoplay fails
        });
    }

    function setAlarm() {
        if (userAlarmChoice) {
            const [alarmHours, alarmMinutes] = userAlarmChoice.split(":");
            console.log(`${alarmHours}, ${alarmMinutes}`);
            savedAlarms.set((alarmHours * 60 + alarmMinutes), {
                full: userAlarmChoice,
                hours: alarmHours,
                minutes: alarmMinutes,
                timestamp: calculateNextRing(alarmHours, alarmMinutes)
            });
            getNextNearestTime();
            setAlarmBool(true).then(() => {
                const input = document.getElementById('time-input');
                input.value = '';
                userAlarmChoice = '';
                displaySavedAlarms = [...savedAlarms.values()];
                if (allowCookies) {
                    SetCookie(cookieName, [...savedAlarms.values()], 30);
                }
            });
        }
    }

    function deleteAlarm(alarm) {
        savedAlarms.delete((alarm.hours * 60 + alarm.minutes));

        if (savedAlarms.size === 0) {
            alarmSet = false;
        }
        displaySavedAlarms = [...savedAlarms.values()];
        if (allowCookies) {
            SetCookie(cookieName, [...savedAlarms.values()], 30);
        }
    }

    async function setAlarmBool(trueFalse) {
        alarmSet = trueFalse;
    }

    onMount(() => {
        alarmAudio = new Audio(alarmSound);
        alarmAudio.volume = 1.0;
        alarmAudio.loop = true;
        savedAlarms = new Map();
        //map is total alarm minutes - alarm object

        GetCookie(cookieName).then((value) => {
            if (value.length === 0) {
                showCookiePrompt = true;
                allowCookies = false;
            } else {
                for (let alarm of value) {
                    savedAlarms.set((alarm.hours * 60 + alarm.minutes), alarm);
                }
                displaySavedAlarms = [...savedAlarms.values()];
                showCookiePrompt = false;
                allowCookies = true;
            }
        }).then(() => {
            getNextNearestTime();
            calculateNextRings();
        }).then(() => {
            setAlarmBool(!displaySavedAlarms.length === 0);
        });

        syncTime().then(() => {
            animationFrame = requestAnimationFrame(updateTimeFrame);
        });

        document.getElementById("time-input").addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                setAlarm();
            }
        });

        return () => {
            cancelAnimationFrame(animationFrame);
        }
    });

    $effect(() => {
        if (!alarmPlaying) {
            alarmAudio.pause();
            alarmAudio.currentTime = 0;
        }
    });
</script>

<style lang="css">

    .clock {
        position: relative;
        display: flex;
        flex-direction: column;

        min-height: 100dvh;
        width: 100dvw;
        max-width: 100dvw;

        justify-content: center;
        align-items: center;
    }

    .alarm {
        position: relative;
        display: grid;

        height: 100%;
        width: 100%;

        place-items: center;
        z-index: 5;
    }

    .time {
        color: whitesmoke;
        text-align: center;
    }

    .time h1 {
        font-size: 6rem;
        margin-top: 1rem;
        margin-bottom: 1rem;
    }

    .time h4 {
        font-size: 1rem;
        color: var(--color-accent);
    }

    .alarm-set {
        position: relative;
        display: flex;
        flex-direction: column;

        justify-content: center;
        align-items: center;

        margin-top: 30dvh;
        text-align: center;

        color: whitesmoke;
    }

    .alarm-set label {
        font-size: 1.4rem;
    }

    .set-controls {
        position: relative;
        display: flex;

        gap: 1rem;
    }

    #time-input {

        width: 12rem;

        font-size: 1.5rem;
        padding: 5px;

        background-color: #2a2a2a;
        color: whitesmoke;
        border: none;
        border-radius: 12px;
        margin-top: 10px;
    }

    .alarm-set-btn {
        margin-top: 10px;
    }

    .alarm-comp-container {
        position: relative;
        display: flex;
        flex-wrap: wrap;

        height: fit-content;
        max-width: 90vw;

        justify-content: space-around;
        align-items: center;
        gap: 1rem;
    }

    .alarm-comp {
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

    .alarm-comp span {
        color: var(--color-accent);
    }

    .alarm-comp:hover span {
        opacity: 0.3;
    }

    .alarm-comp:hover p {
        opacity: 0.3;
    }

    .alarm-comp:hover .delete {
        opacity: 1;
        visibility: visible;
    }
</style>

<section id="alarm-clock" class="clock">

    <CookiePrompt message="Would you like to enable cookies for saving alarms?" bind:allowCookies={allowCookies} bind:showPrompt={showCookiePrompt} />
    <Alert message="Alarm for {nextAlarm} is ringing!" iconLink={IconLinks.alertClock} bind:showAlert={alarmPlaying} />

    <div class="shelf">
        <Fireflies fireflyNum={fireflyNum} bind:showFireflies={alarmPlaying} />
    </div>
    <div class="alarm">
        <div class="time">
            <h1>{displayHours}:{displayMinutes}:{displaySeconds} {amPm}</h1>
            <h4>{currentMinuteTime} &#183; {alarmSet ? `Next alarm set for ${nextAlarm.full}` : `No alarms set`}</h4>
        </div>

        <div class="alarm-set">
            <label for="time-input">Set Alarm</label>
            <div class="set-controls">
                <input id="time-input" type="time" bind:value={userAlarmChoice}>
                <button class="alarm-set-btn" onclick={setAlarm}>Set Alarm</button>
            </div>
            <div class="alarm-comp-container">
                {#each displaySavedAlarms as alarm}
                    <div class="alarm-comp">
                        <span>{get12Hr(alarm.hours)}:{alarm.minutes} {getAmPm(alarm.hours)}</span>
                        <p>Next alarm ring: {alarm.timestamp}</p>
                        <button class="delete" onclick={() => deleteAlarm(alarm)}>&#10005;</button>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</section>
