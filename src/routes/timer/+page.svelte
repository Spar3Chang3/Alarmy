<script lang="js">
    import { onMount } from 'svelte';
    import { GetCookie, SetCookie } from '$lib/index.js';
    import Alert from '$lib/Alert.svelte';
    import CookiePrompt from '$lib/CookiePrompt.svelte';
    import Fireflies from '$lib/Fireflies.svelte';

    const cookieName = "TimerTimes";

    let allowCookies = $state(false);
    let allowCookiePrompt = $state(false);



</script>
<style lang="css">

</style>
<section class="timer">
    <div class="shelf"></div>
    <div class="time">

    </div>
</section>