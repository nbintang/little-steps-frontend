import { BACKEND_URL } from "@/constants/api-url";
import { saveToken } from "@/helpers/save-token";
import axios from "axios";
import Cookies from "js-cookie";

export const refreshToken = async () => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/api/auth/refresh-token`,
      null,
      { withCredentials: true }
    );
    const accessToken = response.data.data.accessToken;

    if (accessToken) {
      // Simpan accessToken ke cookie
      Cookies.set("accessToken", accessToken);

      return accessToken;
    }

    return null;
  } catch (error) {
    Cookies.remove("accessToken");
    console.log(error);
    return null;
  }
};
