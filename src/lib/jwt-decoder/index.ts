import { UserPayload } from "@/types/user-payload";
import * as jose from "jose"; 


export const jwtDecode = (token: string) =>
  jose.decodeJwt<UserPayload>(token);
