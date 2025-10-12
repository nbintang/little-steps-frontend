import { useSearchParams } from "next/navigation";

export function useQueryParams<T extends Record<string, string>>() {
  const searchParams = useSearchParams();
  return Object.fromEntries(searchParams.entries()) as Partial<T>;
}