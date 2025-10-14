import { api } from "@/lib/axios-instance/api";
import { SuccessResponse } from "@/types/response"; 
import Cookies from "js-cookie";

export const accessChildService = async (childId: string) => {
  const res = await api.post<
    SuccessResponse<{
      accessInfo: {
        isAllowed: boolean;
        isActive: boolean;
      };
    }>
  >(`/protected/parent/children/${childId}/auth/access`, null);
  Cookies.set("childStatus", JSON.stringify(res.data.data?.accessInfo));
  return res.data;
};
