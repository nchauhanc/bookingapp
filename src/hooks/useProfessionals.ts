import useSWR from "swr";
import type { UserPublic } from "@/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useProfessionals(search?: string) {
  const key = search
    ? `/api/professionals?search=${encodeURIComponent(search)}`
    : "/api/professionals";
  const { data, error, isLoading } = useSWR<UserPublic[]>(key, fetcher);
  return { professionals: data ?? [], error, isLoading };
}
