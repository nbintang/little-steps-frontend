import { ChildGender } from "@/lib/enums/child-gender";

export type ChildrenMutateResponseAPI = {
  name: string;
  birthDate: string;
  gender: string;
  avatarUrl: string;
};

export type ChildrenAPI = {
  id: string;
  name: string;
  birthDate: string;
  gender: ChildGender;
  avatarUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  parent: {
    id: string;
    name: string;
    email: string;
  };
};
