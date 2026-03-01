import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

// For a professional viewing their own slots (all, including booked)
export function useProfessionalSlots(professionalId?: string) {
  const key = professionalId
    ? `/api/professionals/${professionalId}/availability?showAll=true`
    : null;
  const { data, error, isLoading, mutate } = useSWR(key, fetcher);
  return { slots: data ?? [], error, isLoading, mutate };
}

// For a customer viewing a professional's available slots
export function useAvailableSlots(professionalId?: string) {
  const key = professionalId
    ? `/api/professionals/${professionalId}/availability`
    : null;
  const { data, error, isLoading, mutate } = useSWR(key, fetcher);
  return { slots: data ?? [], error, isLoading, mutate };
}
