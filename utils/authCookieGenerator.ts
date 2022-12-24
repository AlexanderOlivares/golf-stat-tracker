import Cookies from 'js-cookie';

export function setCookie(key: string, val: string){
    Cookies.set(key, val, { expires: Number(process.env.COOKIE_EXPIRE) })
}

export function getCookie(key: string | undefined){
    if (!key) return null
    const authCookie = Cookies.get(key)
    if (authCookie) return JSON.parse(authCookie);
    return null;
}

export function removeCookie(key: string){
    Cookies.remove(key)
}
