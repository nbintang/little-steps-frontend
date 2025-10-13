import { UserPayload } from "@/types/user-payload";
import * as jose from "jose";
export const jwtDecode = <T = UserPayload>(token: string) =>
  jose.decodeJwt<T>(token);
