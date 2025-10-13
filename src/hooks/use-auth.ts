import { jwtDecode } from "@/lib/jwt-decoder";
import { ChildJwtPayload } from "@/types/user-payload";
import Cookies from "js-cookie";
export const useAuth = () => {
  const token = Cookies.get("accessToken");
  if (!token) return null;
  const user = jwtDecode(token);
  return user;
};
