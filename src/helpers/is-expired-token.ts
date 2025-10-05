import { jwtDecode } from "@/lib/jwt-decoder";

 
export const isExpiredToken = (token: string | null): boolean => {
  if (!token) return true;
  const { exp } = jwtDecode(token);
  return exp ? exp * 1000 < Date.now() : false;
};