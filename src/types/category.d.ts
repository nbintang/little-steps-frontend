import { CategoryType } from "@/lib/enums/category-type";

export type CategoryAPI = {
  id: string;
  name: string;
  slug: string;
  type: CategoryType;
  createdAt: string;
  updatedAt: string;
};

export type CategoryPublicAPI = {
  id: string;
  name: string;
  slug: string;

  type:CategoryType;
};
