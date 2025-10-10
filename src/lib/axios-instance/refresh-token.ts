import { BACKEND_URL } from "@/constants/api-url";
import { saveToken } from "@/helpers/save-token";
import axios from "axios";

export const refreshToken = async () => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/api/auth/refresh-token`,
      null,
      { withCredentials: true }
    );
    const accessToken = response.data.data.accessToken;
    saveToken(
      { token: accessToken },
    );
    return accessToken;
  } catch (error) {
    console.log(error);
    return null;
  }
};
