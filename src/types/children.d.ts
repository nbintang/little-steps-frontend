import { ChildGender } from "@/lib/enums/child-gender";



export type ChildrenMutateResponseAPI = {
  id: string
  name: string
  birthDate: string
  avatarUrl: string
  createdAt: Date | string
  updatedAt: Date | string
  parent: {
    id: string
    name: string
    email: string
  }
}
export type ChildrenAPIInput = {
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
