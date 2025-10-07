import axios from "axios";

export const urlToFile = async (url: string, filename: string) => {
  const res = await axios.get(url, { responseType: "blob" });
  const blob = res.data;
  return new File([blob], filename, { type: blob.type });
};