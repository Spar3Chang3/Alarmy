<script lang="js">

    let { message = "Would you like to allow cookies?", allowCookies = $bindable(false), showPrompt = $bindable(false) } = $props();


    function noCookies(e) {
        e.preventDefault();

        showPrompt = false;
        allowCookies = false;
    }

    function yesCookies(e) {
        e.preventDefault();

        showPrompt = false;
        allowCookies = true;
    }
</script>
<style>

    .cookie-prompt-wrapper {
        position: absolute;
        display: grid;

        height: 100dvh;
        width: 100dvw;

        place-items: center;

        background-color: rgba(0, 0, 0, 0.6);
        z-index: 10;
        transition: 0.3s ease;
    }

    .hidden {
        opacity: 0;
        visibility: hidden;
    }

    .cookie-consent {
        position: relative;
        display: flex;
        flex-direction: column;

        height: 75%;
        width: 75%;

        justify-content: center;
        align-items: center;
        padding: 1rem;

        border-radius: 12px;
        background-color: #1a1a1a;
    }

    .cookie-consent h2 {
        font-size: 2rem;
        color: whitesmoke;
        text-align: center;
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
</style>
<div class="cookie-prompt-wrapper" class:hidden={!showPrompt}>
    <div class="cookie-consent">
        <h2>{message}</h2>
        <div class="btn-group">
            <button class="no" onclick={noCookies}>No</button>
            <button class="yes" onclick={yesCookies}>Yes</button>
        </div>
    </div>
</div>