"use server"
import axios from "axios";

export const searchLocationService: (
  query?: string
) => Promise<LocationResponse[]> = async (
  query?: string
): Promise<LocationResponse[]> => {
  const response = await axios.get<LocationResponse[]>(
    "https://nominatim.openstreetmap.org/search",
    {
      params: {
        q: query,
        format: "jsonv2",
        addressdetails: 1,
        countrycodes: "id",
        "accept-language": "id",
        limit: 10,
      },
      headers: {
        "User-Agent": "LittleSteps/1.0 (nbintangh@gmail.com)",
      },
    }
  );
  return response.data;
};
