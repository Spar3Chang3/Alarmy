<script>
    let time = $state('00:00:00');
    let hours = $state(0);
    let minutes = $state(0);
    let seconds = $state(0);

    // Update the time state whenever hours, minutes, or seconds change
    function updateTime(h, m, s) {
        const formattedHours = h.toString().padStart(2, '0');
        const formattedMinutes = m.toString().padStart(2, '0');
        const formattedSeconds = s.toString().padStart(2, '0');
        time = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }

    // Handle hours change
    function handleHoursChange(e) {
        const value = parseInt(e.target.value, 10);
        // Ensure hours are between 0-23
        hours = isNaN(value) ? 0 : Math.max(0, Math.min(23, value));
        updateTime(hours, minutes, seconds);
    }

    // Handle minutes change
    function handleMinutesChange(e) {
        const value = parseInt(e.target.value, 10);
        // Ensure minutes are between 0-59
        minutes = isNaN(value) ? 0 : Math.max(0, Math.min(59, value));
        updateTime(hours, minutes, seconds);
    }

    // Handle seconds change
    function handleSecondsChange(e) {
        const value = parseInt(e.target.value, 10);
        // Ensure seconds are between 0-59
        seconds = isNaN(value) ? 0 : Math.max(0, Math.min(59, value));
        updateTime(hours, minutes, seconds);
    }

    // Increment/decrement functions
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
    <h2>Time Picker</h2>

    <div class="input-container">
        <div class="time-input">
            <label for="hours">Hours</label>
            <div class="input-with-arrows">
                <button class="arrow up" onclick={incrementHours}>▲</button>
                <input
                        id="hours"
                        type="number"
                        min="0"
                        max="23"
                        value={hours}
                        oninput={handleHoursChange}
                />
                <button class="arrow down" onclick={decrementHours}>▼</button>
            </div>
        </div>

        <div class="separator">:</div>

        <div class="time-input">
            <label for="minutes">Minutes</label>
            <div class="input-with-arrows">
                <button class="arrow up" onclick={incrementMinutes}>▲</button>
                <input
                        id="minutes"
                        type="number"
                        min="0"
                        max="59"
                        value={minutes}
                        oninput={handleMinutesChange}
                />
                <button class="arrow down" onclick={decrementMinutes}>▼</button>
            </div>
        </div>

        <div class="separator">:</div>

        <div class="time-input">
            <label for="seconds">Seconds</label>
            <div class="input-with-arrows">
                <button class="arrow up" onclick={incrementSeconds}>▲</button>
                <input
                        id="seconds"
                        type="number"
                        min="0"
                        max="59"
                        value={seconds}
                        oninput={handleSecondsChange}
                />
                <button class="arrow down" onclick={decrementSeconds}>▼</button>
            </div>
        </div>
    </div>

    <div class="time-display">
        <p class="label">Selected Time:</p>
        <p class="value">{time}</p>
    </div>
</div>

<style>
    .time-picker-container {
        padding: 24px;
        max-width: 400px;
        margin: 0 auto;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    h2 {
        font-size: 1.25rem;
        font-weight: bold;
        margin-bottom: 16px;
    }

    .input-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: 24px;
    }

    .time-input {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .time-input label {
        margin-bottom: 4px;
        font-size: 0.875rem;
        color: #666;
    }

    .input-with-arrows {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
    }

    .time-input input {
        width: 60px;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
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
    }

    .arrow {
        position: absolute;
        width: 20px;
        height: 20px;
        background: #f0f0f0;
        border: 1px solid #ccc;
        border-radius: 3px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        cursor: pointer;
        user-select: none;
        z-index: 1;
        transition: background-color 0.2s;
    }

    .arrow:hover {
        background-color: #e0e0e0;
    }

    .arrow:active {
        background-color: #d0d0d0;
    }

    .arrow.up {
        top: -10px;
        right: 5px;
    }

    .arrow.down {
        bottom: -10px;
        right: 5px;
    }

    .separator {
        font-size: 1.5rem;
        font-weight: bold;
    }

    .time-display {
        background-color: #f5f5f5;
        padding: 16px;
        border-radius: 4px;
    }

    .time-display .label {
        color: #555;
    }

    .time-display .value {
        font-size: 1.5rem;
        font-family: monospace;
        font-weight: bold;
        text-align: center;
        margin-top: 8px;
    }
</style>