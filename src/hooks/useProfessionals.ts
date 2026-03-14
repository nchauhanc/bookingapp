import useSWR from "swr";
import type { UserPublic } from "@/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useProfessionals(search?: string, city?: string, country?: string) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (city) params.set("city", city);
  if (country) params.set("country", country);

  const query = params.toString();
  const key = query ? `/api/professionals?${query}` : "/api/professionals";

  const { data, error, isLoading } = useSWR<UserPublic[]>(key, fetcher);
  return { professionals: data ?? [], error, isLoading };
}
