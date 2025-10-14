import { ProfileAPI } from "@/types/profile";
import { useFetch } from "./use-fetch";

export type ChildProfileAPI = {
    id: string;
    name: string;
    birthDate: Date;
    avatarUrl: string;
    createdAt: Date;
    updatedAt: Date;
    gender: "MALE" | "FEMALE";
    parent: {
        id: string;
        name: string;
        email: string;
    };
}
const useChildProfile = () => {
  return useFetch<ChildProfileAPI>({
    keys: "child-profile",
    endpoint: "children/profile",
  });
};

export default useChildProfile;
