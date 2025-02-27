<script lang="js">
	import { IconLinks } from '$lib/index.js';

	let { totalTime = 0, hours = 0, minutes = 0, seconds = 0, isRinging = $bindable(false) } = $props();

	let elapsedTime = $state(0);
	let prevElapsedTime = $state(0);

	let timeLeft = $state(0);
	let displayTimeLeft = $state('00:00:00');

	let isRunning = $state(false);

	let displayTotalTime = $state('00:00:00');

</script>
<style>

		.timer-comp {
				position: relative;
				display: grid;
				grid-template-columns: 34% 33% 33%;

				height: fit-content;
				max-width: 12rem;

				place-items: center;
				gap: 0.5rem;
		}

		.time-circle {
				position: relative;
				display: grid;

				height: 90%;
				width: fit-content;

				border-radius: 50%;
				z-index: 7;
		}

		.circle {
				position: absolute;

				height: 110%;
				width: 110%;

				animation: fillCircle;

				z-index: 6;
		}

    @keyframes fillCircle {
        from {
            background: conic-gradient(var(--color-accent) 0deg, var(--color-accent) 0deg, transparent 0deg);
        }
        to {
            background: conic-gradient(var(--color-accent) 0deg, var(--color-accent) 360deg, transparent 360deg);
        }
    }
</style>
<div class="timer-comp">
	<div class="time-circle">
		<div class="circle" style="animation-duration: {totalTime}ms; animation-play-state: {isRunning ? 'playing' : 'paused'}"></div>
		<span>{displayTimeLeft}</span>
	</div>
	<div class="time-total">
		<span>{displayTotalTime} timer</span>
	</div>
	<div class="controls">
		<button class="start-stop-btn" aria-label="Start/Stop"><img src={isRunning ? IconLinks.stop : IconLinks.play} alt="play/pause icon"/></button>
		<button class="delete-btn" aria-label="Delete"><img src={IconLinks.trash} alt="delete"/></button>
	</div>
</div>