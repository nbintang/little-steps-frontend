import { api } from "@/lib/axios-instance/api";

export const logoutService = async () => await api.delete("/auth/logout");
