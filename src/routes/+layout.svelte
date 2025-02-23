<script lang="js">
    let { children } = $props();

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

        --color-background: #1a1a1a;
        --color-foreground: #2a2a2a;
        --color-accent: #ffba4d;
    }

    main {
        position: relative;

        min-height: 100dvh;
        width: 100dvw;
        max-width: 100dvw;

        background-color: #1a1a1a;
        overflow: hidden;
    }
</style>
<main>
    {@render children()}
</main>