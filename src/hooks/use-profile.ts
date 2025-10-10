import { ProfileAPI } from "@/types/profile";
import { useFetch } from "./use-fetch";

const useProfile = () => {
  return useFetch<ProfileAPI>({
    keys: "profile",
    endpoint: "profile/me",
  });
};

export default useProfile;
