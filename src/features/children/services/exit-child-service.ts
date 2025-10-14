"use server";
import { removeToken } from "@/helpers/remove-token";
import { api } from "@/lib/axios-instance/api";
export const exitChildService = async (id: string) => {
  const res = await api.delete(`/protected/parent/children/${id}/auth/exit`);
  await removeToken();
  return res.data.message;
};
