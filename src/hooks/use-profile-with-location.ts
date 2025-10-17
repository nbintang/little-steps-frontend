import { ProfileAPI, ProfileDetailAPIWithLocation } from "@/types/profile";
import { useFetch } from "./use-fetch";
import useProfile from "./use-profile";
import { useQuery } from "@tanstack/react-query";
import { getLocationService } from "@/features/admin/services/get-location-service";
import React from "react";

const useProfileDetail = () => {
   const { data, ...userState } = useProfile();
  const { data: location } = useQuery({
    queryKey: ["location",data?.id ],
    queryFn: async () =>
      await getLocationService(
        data?.latitude || 0,
        data?.longitude || 0
      ),
    enabled: !!(data?.latitude && data?.longitude),
  });
  console.log(data?.latitude,data?.longitude);
  console.log(location);
  
  const locationString = location?.display_name;
  const user = React.useMemo(() => {
    return {
      ...data,
      location: locationString,
    };
  }, [data, locationString]);
  console.log("location", user.location);
  
  return { data: user as ProfileDetailAPIWithLocation, ...userState };
};

export default useProfileDetail;