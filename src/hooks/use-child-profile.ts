import { ProfileAPI } from "@/types/profile";
import { useFetch } from "./use-fetch";

const useChildProfile = () => {
  return useFetch<ProfileAPI>({
    keys: "child-profile",
    endpoint: "children/profile",
  });
};

export default useChildProfile;
