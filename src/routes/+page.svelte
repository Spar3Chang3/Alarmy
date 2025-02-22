<script lang="js">
    //TODO: change lower text to use 12h, possibly implement timer.

    import { onMount } from 'svelte';

    const alarmSound = "/default/YOU-WOULD-NOT-BELIEVE-YOUR-EYES.mp3";
    const fireflyNum = makeArray(25);
    const cookieName = "AlarmTimes";

    let showCookiePrompt = $state(true);
    let allowCookies = $state(false);

    let currentTime = $state('');
    let alarmAudio = $state(null)

    let currentHours = $state('');
    let currentMinutes = $state('');
    let currentSeconds = $state(0);
    let amPm = $state('');

    let alarmTimes = $state([]);
    let alarmTime = $state('');
    let currentUserAlarmChoice = $state('');
    let alarmPlayed = $state(false);
    let alarmSet = $state(false);

    function makeArray(number) {
        return  Array.from({ length: number }, (_, i) => i + 1);
    }

    function formatTwoDigits(num) {
        return num.toString().padStart(2, '0');
    }

    function setCookie() {
        if (allowCookies) {
            document.cookie = cookieName + "=" + JSON.stringify(alarmTimes) + "; path=/";
        }
    }

    async function getCookie() {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [key, value] = cookie.split('=');
            if (key === cookieName) {
                alarmTimes = value ? JSON.parse(decodeURIComponent(value)) : [];
            }
        }
    }

    function noCookies(e) {
        e.preventDefault();

        showCookiePrompt = false;
        allowCookies = false;

        console.log(allowCookies);
    }

    function yesCookies(e) {
        e.preventDefault();

        showCookiePrompt = false;
        allowCookies = true;

        console.log(allowCookies);
    }

    function getCurrentDay() {
        const date = new Date();

        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();

        return `${month}/${day}/${year}`;
    }

    function getNextDay() {
        const date = new Date();

        const nextDay = new Date(date);

        nextDay.setDate(date.getDate() + 1);

        const month = String(nextDay.getMonth() + 1).padStart(2, '0');
        const day = String(nextDay.getDate()).padStart(2, '0');
        const year = nextDay.getFullYear();

        return `${month}/${day}/${year}`;
    }

    function calculateNextRings() {
        const currentFullMinutes = (Number(currentHours) * 60) + Number(currentMinutes);

        for (let alarm of alarmTimes) {
            const [hour, minute] = alarm.alarm.split(':').map(Number);
            const fullAlarmMinutes = hour * 60 + minute;

            if (fullAlarmMinutes <= currentFullMinutes) {
                deleteAlarm(alarm);
                alarmTimes.push({
                    alarm: alarm.alarm,
                    timestamp: getNextDay()
                });
            }
        }
    }

    function calculateNextRing(alarmTime) {
        const currentFullMinutes = (Number(currentHours) * 60) + Number(currentMinutes);

        const [hour, minute] = alarmTime.split(':').map(Number);
        const fullAlarmMinutes =  hour * 60 + minute;

        if (fullAlarmMinutes <= currentFullMinutes) {
            return getNextDay();
        } else {
            return getCurrentDay();
        }
    }

    function getRandomFireflyStyle() {
        const randomX = Math.random() * window.innerWidth;
        const randomDelay = Math.random() * 10;

        return `left: ${randomX}px; animation-delay: ${randomDelay}s;`;
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
        alarmTime = `${String(nextHour).padStart(2, '0')}:${String(nextMinute).padStart(2, '0')}`;
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
            currentHours = formatTwoDigits(hours % 12);
        } else {
            amPm = 'AM';
            currentHours = formatTwoDigits(hours);
        }

        currentMinutes = formatTwoDigits(now.getMinutes());
        currentSeconds = now.getSeconds();

        if (alarmSet) {
            if (currentTime === alarmTime && !alarmPlayed) {
                playAlarm();
                alarmPlayed = true;

                document.getElementById("alarm-clock").addEventListener("click", () => {
                    alarmPlayed = false;
                    alarmAudio.pause();
                    alarmAudio.currentTime = 0;
                });

                calculateNextRings();
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
            document.getElementById('time-input').value = '';
            currentUserAlarmChoice = '';
            getNextNearestTime();
            setCookie();
        }
    }

    function deleteAlarm(alarm) {
        alarmTimes = alarmTimes.filter(time => time !== alarm);
    }

    onMount(() => {
        alarmAudio = new Audio(alarmSound);
        alarmAudio.volume = 0.75;
        alarmAudio.loop = true;

        getCookie().then(() => {
            if (alarmTimes.length === 0) {
                showCookiePrompt = true;
                allowCookies = false;
            } else {
                showCookiePrompt = false;
                allowCookies = true;
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
</script>

<style lang="css">

    :global(html, body) {
        margin: 0 auto;
    }

    :root {
        font-family: Roboto, sans-serif;

        --dot-bg: #1a1a1a;
        --dot-color: white;
        --dot-size: 1px;
        --dot-space: 60px;
    }

    .cookie-prompt {
        position: absolute;
        display: grid;

        height: 100dvh;
        width: 100dvw;

        place-items: center;

        background-color: rgba(0, 0, 0, 0.6);
        z-index: 10;
        transition: 0.3s ease;
    }

    .deprompt {
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
    }

    .cookie-consent {
        position: relative;
        display: flex;
        flex-direction: column;

        height: 50%;
        width: 50%;

        justify-content: center;
        align-items: center;

        border-radius: 12px;
        background-color: #1a1a1a;
    }

    .cookie-consent h2 {
        font-size: 2rem;
        color: whitesmoke;
    }

    .btn-group {
        position: relative;
        display: flex;

        height: fit-content;
        width: fit-content;

        justify-content: center;
        align-items: center;
        gap: 0.5rem;
    }

    .no {
        width: 12rem;

        margin-top: 0;
        padding: 10px 20px;
        font-size: 1rem;
        cursor: pointer;
        border: none;
        border-radius: 12px;

        color: whitesmoke;
        transition: 0.3s ease;
        background-color: #2a2a2a;
    }

    .yes {
        width: 12rem;

        margin-top: 0;
        padding: 10px 20px;
        font-size: 1rem;
        cursor: pointer;
        border: none;
        border-radius: 12px;

        transition: 0.3s ease;
        background-color: #ffba4d;
    }

    main {
        position: relative;
        display: flex;
        flex-direction: column;
        min-height: 100dvh;
        width: 100dvw;
        max-width: 100dvw;
        justify-content: center;
        align-items: center;

        background-color: #1a1a1a;
        overflow: hidden;
    }

    .firefly {
        position: absolute;
        bottom: -5%;
        width: 10px;
        height: 10px;
        background-color: #ffba4d;
        border-radius: 50%;
        animation: fly 8s linear infinite, flash 1s ease-in-out infinite;
    }

    @keyframes fly {
        0% {
            bottom: 0;
        }
        100% {
            bottom: 80%;
        }
    }

    @keyframes flash {
        0%, 100% {
            opacity: 0.8;
        }
        50% {
            opacity: 0.3;
        }
    }

    .shelf {
        position: absolute;

        height: 100%;
        width: 100%;

        z-index: 4;

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

    .clock {
        color: whitesmoke;
        text-align: center;
    }

    .clock h1 {
        font-size: 6rem;
        margin-top: 1rem;
        margin-bottom: 1rem;
    }

    .clock h4 {
        font-size: 1rem;
        color: #ffba4d;
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

        background-color: #ffba4d;
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

        border: #2a2a2a dashed 0.1rem;
        background-color: #1a1a1a;
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

<main id="alarm-clock">
    <div class="cookie-prompt" class:deprompt={!showCookiePrompt}>
        <div class="cookie-consent">
            <h2>Would you like to allow cookies to store your previous alarms?</h2>
            <div class="btn-group">
                <button class="no" onclick={noCookies}>No</button>
                <button class="yes" onclick={yesCookies}>Yes</button>
            </div>
        </div>
    </div>
    <div class="shelf">
        {#if alarmPlayed}
            {#each fireflyNum as i}
                <div class="firefly" style={getRandomFireflyStyle()}></div>
            {/each}
        {/if}
    </div>
    <div class="alarm">
        <div class="clock">
            <h1>{currentHours}:{currentMinutes}:{formatTwoDigits(currentSeconds)} {amPm}</h1>
            <h4>{currentTime} &#183; {alarmSet ? `Next alarm set for ${alarmTime}` : `No alarms set`}</h4>
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
                        <span style="color: #ffba4d">{alarm.alarm}</span>
                        <p>Next alarm ring: {alarm.timestamp}</p>
                        <button class="delete" onclick={() => deleteAlarm(alarm)}>&#10005;</button>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</main>
