<script lang="js">
    //TODO: change lower text to use 12h, possibly implement timer, implement unobtrusive forced user interaction for sound

    import { onMount } from 'svelte';
    import { GetCookie, SetCookie, MakeNumberArray, FormatNumberString, GetCurrentDay, GetNextDay, IconLinks } from '$lib/index.js';
    import Fireflies from '$lib/Fireflies.svelte';
    import CookiePrompt from '$lib/CookiePrompt.svelte';
    import Alert from '$lib/Alert.svelte';

    const alarmSound = "/default/YOU-WOULD-NOT-BELIEVE-YOUR-EYES.mp3";
    const fireflyNum = MakeNumberArray(0, 50);
    const cookieName = "AlarmTimes";

    let allowCookies = $state(false);
    let showCookiePrompt = $state(true);

    let currentTime = $state('');
    let alarmAudio = $state(null)

    let currentHours = $state('');
    let currentMinutes = $state('');
    let currentSeconds = $state(0);
    let amPm = $state('');

    let alarmTimes = $state([]);
    let nextAlarm = $state('');
    let currentUserAlarmChoice = $state('');

    let alarmPlaying = $state(false);
    let alarmSet = $state(false);

    function calculateNextRings() {
        const currentFullMinutes = (Number(currentHours) * 60) + Number(currentMinutes);

        for (let alarm of alarmTimes) {
            const [hour, minute] = alarm.alarm.split(':').map(Number);
            const fullAlarmMinutes = hour * 60 + minute;

            if (fullAlarmMinutes <= currentFullMinutes) {
                deleteAlarm(alarm);
                alarmTimes.push({
                    alarm: alarm.alarm,
                    timestamp: GetNextDay()
                });
            }
        }
    }

    function calculateNextRing(alarmTime) {
        const currentFullMinutes = (Number(currentHours) * 60) + Number(currentMinutes);

        const [hour, minute] = alarmTime.split(':').map(Number);
        const fullAlarmMinutes =  hour * 60 + minute;

        if (fullAlarmMinutes <= currentFullMinutes) {
            return GetNextDay()
        } else {
            return GetCurrentDay()
        }
    }

    function getNextNearestTime() {
        const currentFullMinutes = (Number(currentHours) * 60) + Number(currentMinutes);

        //Convert each time string "HH:mm" into minutes since midnight.
        const timesInMinutes = alarmTimes.map(time => {
            const [hour, minute] = time.alarm.split(':').map(Number);
            return hour * 60 + minute;
        });

        const futureTimes = timesInMinutes.filter(timeMinutes => timeMinutes > currentFullMinutes);

        //Determine the next time. If no times are in the future, return the earliest time the next day.
        let nextTimeMinutes = futureTimes.length > 0
            ? Math.min(...futureTimes)
            : Math.min(...timesInMinutes);



        //Convert minutes back to HH:mm format.
        const nextHour = Math.floor(nextTimeMinutes / 60);
        const nextMinute = nextTimeMinutes % 60;
        nextAlarm = `${FormatNumberString(nextHour)}:${FormatNumberString(nextMinute)}`;
    }


    async function getCurrentTime() {
        const now = new Date();
        currentTime = now.toLocaleTimeString([], { hourCycle: "h23", hour: '2-digit', minute: '2-digit'});
        const hours = now.getHours();

        if (hours === 0) {
            amPm = 'AM';
            currentHours = '12';
        } else if (hours > 12) {
            amPm = 'PM';
            currentHours = FormatNumberString(hours % 12);
        } else {
            amPm = 'AM';
            currentHours = FormatNumberString(hours);
        }

        currentMinutes = FormatNumberString(now.getMinutes());
        currentSeconds = now.getSeconds();

        if (alarmSet) {
            if (currentTime === nextAlarm && !alarmPlaying) {
                playAlarm();
                alarmPlaying = true;

                calculateNextRings();
                getNextNearestTime();
            }
        }
    }

    async function count() {
        currentSeconds++;

        if (currentSeconds === 60) {
            await getCurrentTime();
        }
    }

    function playAlarm() {
        alarmAudio.play().catch(() => {
            console.log('Autoplay blocked by browser');
            alarmAudio.play(); //Fallback if autoplay fails
        });
    }

    function setAlarm() {
        if (currentUserAlarmChoice) {
            console.log(`Alarm set for: ${currentUserAlarmChoice}`);
            alarmTimes.push({
                alarm: currentUserAlarmChoice,
                timestamp: calculateNextRing(currentUserAlarmChoice)
            });
            alarmSet = true;
            const input = document.getElementById('time-input');
            input.value = '';
            currentUserAlarmChoice = '';
            getNextNearestTime();
            if (allowCookies) {
                SetCookie(cookieName, alarmTimes, 30);
            }
        }
    }

    function deleteAlarm(alarm) {
        alarmTimes = alarmTimes.filter(time => time !== alarm);
        if (alarmTimes.length === 0) {
            alarmSet = false;
        }
        if (allowCookies) {
            SetCookie(cookieName, alarmTimes, 30);
        }
    }

    onMount(() => {
        alarmAudio = new Audio(alarmSound);
        alarmAudio.volume = 1.0;
        alarmAudio.loop = true;

        GetCookie(cookieName).then((value) => {
            if (value.length === 0) {
                showCookiePrompt = true;
                allowCookies = false;
            } else {
                alarmTimes = value;
                showCookiePrompt = false;
                allowCookies = true;
                alarmSet = true;
                getNextNearestTime();
                calculateNextRings();
            }
        });

        getCurrentTime().then(() => {
            setInterval(count, 1000);
        });

        document.getElementById("time-input").addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                setAlarm();
            }
        });
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

    .shelf {
        position: absolute;

        height: 100dvh;
        width: 100dvw;

        z-index: 2;

        filter: blur(2px);

        background:
                linear-gradient(90deg, var(--dot-bg) calc(var(--dot-space) - var(--dot-size)), transparent 1%) center / var(--dot-space) var(--dot-space),
                linear-gradient(var(--dot-bg) calc(var(--dot-space) - var(--dot-size)), transparent 1%) center / var(--dot-space) var(--dot-space),
                var(--dot-color);
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

    button {

        width: 12rem;

        padding: 10px 20px;
        font-size: 1rem;
        cursor: pointer;
        border: none;
        border-radius: 12px;

        background-color: var(--color-accent);
        transition: 0.3s ease;
    }

    button:active {
        transform: scale(0.95);
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

    span {
        display: block;
        margin-top: 10px;
        font-size: 1.4rem;
        transition: 0.3s ease;
    }

    p {
        display: block;
        margin-top: 10px;
        font-size: 1rem;
        transition: 0.3s ease;
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
            <h1>{currentHours}:{currentMinutes}:{FormatNumberString(currentSeconds)} {amPm}</h1>
            <h4>{currentTime} &#183; {alarmSet ? `Next alarm set for ${nextAlarm}` : `No alarms set`}</h4>
        </div>

        <div class="alarm-set">
            <label for="time-input">Set Alarm</label>
            <div class="set-controls">
                <input id="time-input" type="time" bind:value={currentUserAlarmChoice}>
                <button class="alarm-set-btn" onclick={setAlarm}>Set Alarm</button>
            </div>
            <div class="alarm-comp-container">
                {#each alarmTimes as alarm}
                    <div class="alarm-comp">
                        <span>{alarm.alarm}</span>
                        <p>Next alarm ring: {alarm.timestamp}</p>
                        <button class="delete" onclick={() => deleteAlarm(alarm)}>&#10005;</button>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</section>
