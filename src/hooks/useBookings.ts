import useSWR from "swr";
import type { BookingPublic } from "@/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useBookings(view?: "professional") {
  const key = view ? `/api/bookings?view=${view}` : "/api/bookings";
  const { data, error, isLoading, mutate } = useSWR<BookingPublic[]>(key, fetcher);
  return { bookings: data ?? [], error, isLoading, mutate };
}
