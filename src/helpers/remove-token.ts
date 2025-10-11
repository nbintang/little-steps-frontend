"use server"
import { cookies } from "next/headers";

export const removeToken = async (key: string = "accessToken") => {
    const cookieStore = await cookies();
    cookieStore.delete("refreshToken");
    cookieStore.delete(key);
}