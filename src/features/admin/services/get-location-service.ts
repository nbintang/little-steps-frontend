import axios from "axios";

export const getLocationService = async (
  lat: number,
  lon: number
): Promise<LocationResponse> => {
  const res = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
    params: {
      format: "jsonv2",
      lat,
      lon,
    },
  });

  return res.data;
};
