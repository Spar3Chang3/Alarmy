<script lang="js">
    import { onMount } from 'svelte';
    import { MakeNumberArray } from '$lib/index.js';

    let { fireflyNum = MakeNumberArray(0, 50), showFireflies = $bindable(false) } = $props();

    let innerWidth = $state();

    function getRandomFireflyStyle() {
        const randomX = Math.random() * innerWidth;
        const randomDelay = Math.random() * 10;

        return `left: ${randomX}px; animation-delay: ${randomDelay}s;`;
    }

    onMount(() => {
        innerWidth = window.innerWidth;
    });

</script>
<style lang="css">
    .firefly {
        position: absolute;
        bottom: -5%;
        width: 10px;
        height: 10px;
        background-color: var(--color-accent);
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
</style>
{#if showFireflies}
    {#each fireflyNum as i}
        <div class="firefly" style={getRandomFireflyStyle()}></div>
    {/each}
{/if}