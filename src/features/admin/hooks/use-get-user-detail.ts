import { useFetch } from "@/hooks/use-fetch";
import { UserDetailAPI } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getLocationService } from "../services/get-location-service";
 
export type UserDetailAPIWithLocation = Partial<UserDetailAPI> & { location: string };

const useGetUserDetail = (id: string) => {
  const { data, ...userState } = useFetch<UserDetailAPI & { location: string }>(
    {
      keys: ["users", id],
      endpoint: `users/${id}`,
    }
  );
  const { data: location } = useQuery({
    queryKey: ["location", id],
    queryFn: async () =>
      await getLocationService(
        data?.profile.latitude || 0,
        data?.profile.longitude || 0
      ),
    enabled: !!data?.profile.latitude && !!data?.profile.longitude,
  });
  const locationString = location?.display_name || data?.location || "Unknown";
  const user = React.useMemo(() => {
    return {
      ...data,
      location: locationString,
    };
  }, [data, locationString]);
  return { data: user, ...userState };
};

export default useGetUserDetail;
