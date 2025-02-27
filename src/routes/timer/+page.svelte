<script lang="js">
    import { onMount } from 'svelte';
    import { GetCookie, SetCookie } from '$lib/index.js';
    import '$lib/common.css';
    import Alert from '$lib/Alert.svelte';
    import CookiePrompt from '$lib/CookiePrompt.svelte';
    import Fireflies from '$lib/Fireflies.svelte';
    import TimePicker from '$lib/TimePicker.svelte';

    const cookieName = "TimerTimes";

    let allowCookies = $state(false);
    let allowCookiePrompt = $state(false);

    let timerSet = $state(false);

    let hours = $state(0);
    let minutes = $state(0);
    let seconds = $state(0);

</script>
<style lang="css">



</style>
<section class="timer">
    <div class="shelf"></div>
    <div class="timer-comp-container">

    </div>
    <div class="new-timer-container">
        <TimePicker/>
    </div>
</section>