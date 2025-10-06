import { api } from "@/lib/axios-instance/api";
import { CategoryAPI } from "@/types/category";
import { SuccessResponsePaginated } from "@/types/response";

export const categoryService = async (query?: string): Promise<CategoryAPI[]> => {
  const response = await api.get<SuccessResponsePaginated<CategoryAPI[]>>("/protected/categories", {
    params: { keyword: query },
  });
  return response.data.data ?? [];
};
