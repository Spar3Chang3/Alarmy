<script lang="js">
	import { FormatNumberString, IconLinks } from '$lib/index.js';
	import { onMount } from 'svelte';

	let { totalTimeMs = 0, isRinging = $bindable(false), callback = (timer) => {} } = $props();

	let animationFrame = $state();

	let startTime = $state(0);
	let elapsedTime = $state(0);
	let prevElapsedTime = $state(0);

	let timeLeft = $state(0);
	let displayTimeLeft = $derived(`${FormatNumberString(hours)}:${FormatNumberString(minutes)}:${FormatNumberString(seconds)}`);

	let hours = $state(0);
	let minutes = $state(0);
	let seconds = $state(0);

	let isRunning = $state(false);

	let displayTotalTime = $state('00:00:00');

	function startTimer(e) {
		if (e) {
			e.preventDefault();
		}

		startTime = performance.now();
		isRunning = true;
		animationFrame = requestAnimationFrame(countDown);
	}

	function stopTimer(e) {
		if (e) {
			e.preventDefault();
		}

		prevElapsedTime = performance.now() - startTime;
		isRunning = false;
		cancelAnimationFrame(animationFrame);
	}

	function deleteTimer(e) {
		if (e) {
			e.preventDefault();
		}

		callback(totalTimeMs);
	}

	function countDown() {
		elapsedTime = (performance.now() - startTime) + prevElapsedTime;
		timeLeft = totalTimeMs - elapsedTime;

		hours = Math.floor(timeLeft / 3600000);
		minutes = Math.floor(timeLeft / 60000);
		seconds = Math.floor(timeLeft / 1000);
	}

	onMount(() => {
		console.log(totalTimeMs);

		const hours = Math.floor(totalTimeMs / 3600000);
		const minutes = Math.floor(totalTimeMs / 60000);
		const seconds = Math.floor(totalTimeMs / 1000);

		displayTotalTime = `${FormatNumberString(hours)}:${FormatNumberString(minutes)}:${FormatNumberString(seconds)}`;
	});

</script>
<style>

		.timer-comp {
				position: relative;
				display: grid;
				grid-template-columns: 34% 33% 33%;

				height: fit-content;
				max-width: 16rem;

				place-items: center;
				gap: 0.5rem;
		}

		.time-circle {
				position: relative;
				display: grid;

				height: 90%;
				width: fit-content;

				place-items: center;

				border-radius: 50%;
				z-index: 7;
		}

		.circle {
				position: absolute;

				height: 100%;
				width: 100%;

				animation: fillCircle;

				z-index: 6;
		}

		.time-total {
				display: grid;

				height: 100%;
				width: 100%;

				place-items: center;
		}

		.controls {
				position: relative;
				display: grid;
				grid-template-rows: 50% 50%;

				height: 100%;
				width: 100%;

				place-items: center;
				gap: 0.5rem;
		}

		.start-stop-btn, .delete-btn{
				height: 3rem;
				width: 3rem;

				border: none;
				border-radius: 12px;
				cursor: pointer;
				padding: 0.5rem;
				margin: 0 auto;
		}

		.start-stop-btn {
				background-color: var(--color-accent);
		}

		.delete-btn {
				background-color: var(--color-foreground);
		}

		.controls img {
				position: relative;
				height: 2.5rem;
				width: 2.5rem;

				object-fit: contain;
				object-position: center;
				margin: 0 auto;
				padding: 0;
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
		<div class="circle" style="animation-duration: {totalTimeMs}ms; animation-play-state: {isRunning ? 'playing' : 'paused'}"></div>
		<span>{displayTimeLeft}</span>
	</div>
	<div class="time-total">
		<span>{displayTotalTime} timer</span>
	</div>
	<div class="controls">
		<button class="start-stop-btn" aria-label="Start/Stop" onclick={isRunning ? stopTimer : startTimer}><img src={isRunning ? IconLinks.stop : IconLinks.play} alt="play/pause icon"/></button>
		<button class="delete-btn" aria-label="Delete" onclick={deleteTimer}><img src={IconLinks.trash} alt="delete"/></button>
	</div>
</div>