import Cookies from "js-cookie";
export const removeToken = (key: string = "accessToken") => Cookies.remove(key);
