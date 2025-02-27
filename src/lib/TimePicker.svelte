<script>
    import { FormatNumberString } from '$lib/index.js';

    let { time = ('00:00:00'), hours = $bindable(0), minutes = $bindable(0), seconds = $bindable(0) } = $props();

    function updateTime(h, m, s) {
        const formattedHours = FormatNumberString(h);
        const formattedMinutes = FormatNumberString(m);
        const formattedSeconds = FormatNumberString(s);
        time = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }

    function handleHoursChange(e) {
        const value = parseInt(e.target.value, 10);

        hours = isNaN(value) ? 0 : Math.max(0, Math.min(23, value));
        updateTime(hours, minutes, seconds);

        if (hours.toString().length === 2) {
            document.getElementById('minutes').focus();
        }
    }

    function handleMinutesChange(e) {
        const value = parseInt(e.target.value, 10);

        minutes = isNaN(value) ? 0 : Math.max(0, Math.min(59, value));
        updateTime(hours, minutes, seconds);

        if (minutes.toString().length === 2) {
            document.getElementById('seconds').focus();
        }
    }

    function handleSecondsChange(e) {
        const value = parseInt(e.target.value, 10);

        seconds = isNaN(value) ? 0 : Math.max(0, Math.min(59, value));
        updateTime(hours, minutes, seconds);
    }

    function incrementHours() {
        hours = (hours + 1) % 24;
        updateTime(hours, minutes, seconds);
    }

    function decrementHours() {
        hours = (hours - 1 + 24) % 24;
        updateTime(hours, minutes, seconds);
    }

    function incrementMinutes() {
        minutes = (minutes + 1) % 60;
        updateTime(hours, minutes, seconds);
    }

    function decrementMinutes() {
        minutes = (minutes - 1 + 60) % 60;
        updateTime(hours, minutes, seconds);
    }

    function incrementSeconds() {
        seconds = (seconds + 1) % 60;
        updateTime(hours, minutes, seconds);
    }

    function decrementSeconds() {
        seconds = (seconds - 1 + 60) % 60;
        updateTime(hours, minutes, seconds);
    }
</script>

<div class="time-picker-container">
    <div class="input-container">
        <div class="time-input">
            <div class="btn-group">
                <button class="arrow up" onclick={incrementHours}>▲</button>
                <button class="arrow down" onclick={decrementHours}>▼</button>
            </div>
            <div class="input-with-arrows">
                <label for="hours">Hours</label>
                <input
                        id="hours"
                        type="number"
                        min="0"
                        max="23"
                        value={FormatNumberString(hours)}
                        oninput={handleHoursChange}
                />
            </div>
        </div>

        <div class="separator">:</div>

        <div class="time-input">
            <div class="btn-group">
                <button class="arrow up" onclick={incrementMinutes}>▲</button>
                <button class="arrow down" onclick={decrementMinutes}>▼</button>
            </div>
            <div class="input-with-arrows">
                <label for="minutes">Minutes</label>
                <input
                        id="minutes"
                        type="number"
                        min="0"
                        max="59"
                        value={FormatNumberString(minutes)}
                        oninput={handleMinutesChange}
                />
            </div>
        </div>

        <div class="separator">:</div>

        <div class="time-input">
            <div class="btn-group">
                <button class="arrow up" onclick={incrementSeconds}>▲</button>
                <button class="arrow down" onclick={decrementSeconds}>▼</button>
            </div>
            <div class="input-with-arrows">
                <label for="seconds">Seconds</label>
                <input
                        id="seconds"
                        type="number"
                        min="0"
                        max="59"
                        value={FormatNumberString(seconds)}
                        oninput={handleSecondsChange}
                />
            </div>
        </div>
    </div>

    <div class="time-display">
        <h2 class="value">{time}</h2>
    </div>
</div>

<style>
    .time-picker-container {
        padding: 1rem;
        max-width: 25rem;
        margin: 0 auto;
        background-color: var(--color-background);
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        z-index: 5;
    }

    .input-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .time-input {
        position: relative;
        display: flex;

        justify-content: center;
        align-items: center;
        gap: 0.25rem;
    }

    .time-input label {
        position: absolute;
        top: -1.25rem;

        font-size: 1rem;
        color: var(--color-accent);
    }

    .input-with-arrows {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
    }

    .time-input input {
        width: 4rem;
        padding: 0.25rem;
        border: 0.1rem solid var(--color-tertiary);
        border-radius: 6px;
        text-align: center;
    }

    /* Remove spinner buttons from number inputs */
    .time-input input::-webkit-outer-spin-button,
    .time-input input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    .time-input input[type=number] {
        -moz-appearance: textfield; /* Firefox */
        background-color: #3a3a3a;
        color: whitesmoke;
    }

    .btn-group {
        position: relative;
        display: grid;
        grid-template-rows: 50% 50%;

        height: fit-content;
        width: fit-content;

        place-items: center;
        gap: 0.5rem;
    }

    .arrow {
        position: relative;
        width: 1.5rem;
        height: 1.5rem;
        background: var(--color-foreground);
        border: none;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        cursor: pointer;
        user-select: none;
        z-index: 1;
        transition: background-color 0.2s;
        color: whitesmoke;
    }

    .arrow:hover {
        background-color: #e0e0e0;
    }

    .arrow:active {
        background-color: #d0d0d0;
    }

    .separator {
        font-size: 1.5rem;
        font-weight: bold;
        color: whitesmoke;
    }

    .time-display {
        color: whitesmoke;
        padding: 16px;
        border-radius: 4px;
    }

    .time-display .value {
        font-size: 2rem;
        font-family: monospace;
        font-weight: bold;
        text-align: center;
        margin-top: 8px;
    }
</style>