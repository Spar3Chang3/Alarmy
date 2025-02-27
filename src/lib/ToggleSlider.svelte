<script lang="js">
	let { height = '2.5rem', width = '5rem', toggleState = $bindable(false), callback = (state) => {} } = $props();


	function toggle(e) {
		e.preventDefault();

		toggleState = !toggleState;
		callback(toggleState);
	}
</script>
<style lang="css">
	.toggle-slider {
			position: relative;
			display: flex;
			flex-direction: row;

			align-items: center;
			padding: 0.25rem;

			transition: all 0.2s ease;
			border-radius: 12px;
			z-index: 5;
	}

	.toggle-ball {
			position: relative;

			height: 100%;
			width: 50%;

			background-color: var(--color-accent);
			border-radius: 50%;

			transition: all 0.2s ease;
	}

	.toggle-ball-left {
			opacity: 0.8;
			transform: translateX(0);
	}

	.toggle-ball-right {
			opacity: 1;
			transform: translateX(100%);
	}

	.toggle-slider-toggle {
			position: absolute;

			height: 100%;
			width: 100%;

			border: none;
			background-color: transparent;
	}

	.toggle-slider-toggle:active {
			border: none;
			background-color: transparent;
	}
</style>
<div class="toggle-slider" style="background-color: {toggleState ? 'whitesmoke' : '#2a2a2a'}; height: {height}; width: {width};">
	<div class="toggle-ball" class:toggle-ball-left={!toggleState} class:toggle-ball-right={toggleState}></div>
	<button class="toggle-slider-toggle" aria-label="ghost-button" onclick={toggle}></button>
</div>