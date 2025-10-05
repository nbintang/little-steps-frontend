import Cookies from "js-cookie";

interface SaveTokenOptions {
  token: string;
  key?: string;
}

export const saveToken = (
  { key = "accessToken", token }: SaveTokenOptions,
  attributes?: Cookies.CookieAttributes
) => {
  Cookies.set(key, token, attributes);
};
