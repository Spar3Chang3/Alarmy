<script lang="js">

    let { fireflyNum = 50, showFireflies = $bindable(false) } = $props();

    function getRandomFireflyStyle() {
        const randomX = Math.random() * window.innerWidth;
        const randomDelay = Math.random() * 10;

        return `left: ${randomX}px; animation-delay: ${randomDelay}s;`;
    }

</script>
<style lang="css">
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
</style>
{#if showFireflies}
    {#each fireflyNum as i}
        <div class="firefly" style={getRandomFireflyStyle()}></div>
    {/each}
{/if}