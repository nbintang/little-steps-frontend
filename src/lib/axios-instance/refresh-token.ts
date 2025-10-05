
import { BACKEND_DEV_URL } from "@/constants/api-url";
import axios from 'axios';
import Cookies from 'js-cookie'; 

export const refreshToken = async () => {
  try {
    const response = await axios.post(
      `${BACKEND_DEV_URL}/api/auth/refresh-token`,
      null,
      {
        withCredentials: true,
      }
    );
    const accessToken = response.data.accessToken;
    Cookies.set("accessToken", accessToken, {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    return accessToken;
  } catch (error) {
    console.log(error);
    return null;
  }
};