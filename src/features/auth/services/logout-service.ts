"use server";
import { removeToken } from "@/helpers/remove-token";
import { api } from "@/lib/axios-instance/api";
export const logoutService = async () => {
  const res = await api.delete("/auth/logout");
  console.log(res.data);
  await removeToken();
  return res.data.message;
};
