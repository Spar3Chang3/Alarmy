<script lang="js">
    import { onMount } from 'svelte';
    import { IconLinks } from '$lib/index.js';

    let { message = "DEFAULT ALERT MESSAGE", action = "Click anywhere to dismiss", iconLink = IconLinks.alertTriangle, showAlert = $bindable(false) } = $props();

    onMount(() => {
        document.getElementById('alert-wrapper').addEventListener('click', (e) => {
            e.preventDefault();

            showAlert = false;
        });
    });

</script>
<style lang="css">

    .alert-wrapper {
        position: absolute;
        display: grid;

        height: 100dvh;
        width: 100dvw;

        place-items: center;

        background-color: rgba(0, 0, 0, 0.4);
        z-index: 8;
        transition: 0.3s ease;
        color: white;
    }

    .hidden {
        opacity: 0;
        visibility: hidden;
    }

    .alert {
        position: relative;
        display: flex;
        flex-direction: column;

        height: 75%;
        width: 75%;

        justify-content: center;
        align-items: center;

        background-color: transparent;
    }

    .icon {
        height: 12rem;
        width: 12rem;
        object-fit: contain;
        object-position: center;
        animation: alarm-bounce 0.5s infinite ease-in-out;
    }

    .alert h2 {
        font-size: 4rem;
        color: whitesmoke;
        text-align: center;
    }

    .alert h3 {
        font-size: 3rem;
        color: whitesmoke;
        text-align: center;
    }

    @keyframes alarm-bounce {
        0%, 100% {
            transform: rotate(0deg);
        }
        25% {
            transform: rotate(-5deg);
        }
        50% {
            transform: rotate(5deg);
        }
        75% {
            transform: rotate(-5deg);
        }
    }


</style>
<div class="alert-wrapper" class:hidden={!showAlert} id="alert-wrapper">
    <div class="alert">
        <img class="icon" alt="Alert Icon" src={iconLink}/>
        <h2>{message}</h2>
        <h3>{action}</h3>
    </div>
</div>