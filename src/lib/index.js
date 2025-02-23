// place files you want to import through the `$lib` alias in this folder.
export async function SetCookie(name, value, days) {
    let expires = "";

    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }

    document.cookie = name + "=" + encodeURIComponent(JSON.stringify(value)) + expires + "; path=/";
}

export async function GetCookie(name) {
    const cookies = document.cookie.split(";");
    console.log(cookies);

    for (let cookie of cookies) {
        const [key, value] = cookie.trim().split('=');
        if (key === name) {
            return value ? JSON.parse(decodeURIComponent(value)) : [];
        }
    }

    return [];

}

export function MakeNumberArray(min, max) {
    return Array.from({ length: max - min + 1 }, (_, i) => min + i);
}

export function FormatNumberString(number, padding) {
    if (!padding) {
        padding = 2;
    }
    return number.toString().padStart(padding, '0');
}

export function GetCurrentDay() {
    const date = new Date();

    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
}

export function GetNextDay() {
    const date = new Date();

    const nextDay = new Date(date);

    nextDay.setDate(date.getDate() + 1);

    const month = String(nextDay.getMonth() + 1).padStart(2, '0');
    const day = String(nextDay.getDate()).padStart(2, '0');
    const year = nextDay.getFullYear();

    return `${month}/${day}/${year}`;
}

export const IconLinks = {
    alertTriangle: '/icons/alert-triangle.svg',
    alertClock: '/icons/alarm.svg'
}
