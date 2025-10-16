import { ProfileAPI } from "@/types/profile";
import { useFetch } from "./use-fetch";
import { useAuth } from "./use-auth";

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
  const user = useAuth()
  return useFetch<ChildProfileAPI>({
    keys: "child-profile",
    endpoint: "children/profile",
    enabled: !!user?.is_registered
  });
};

export default useChildProfile;
