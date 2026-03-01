"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import WeekCalendar from "@/components/calendar/WeekCalendar";
import SlotCreator from "@/components/calendar/SlotCreator";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import { useProfessionalSlots } from "@/hooks/useSlots";

export default function AvailabilityPage() {
  const { data: session } = useSession();
  const { slots, isLoading, mutate } = useProfessionalSlots(session?.user?.id);

  const [creatorOpen, setCreatorOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  function handleAddSlot(date: Date) {
    setSelectedDate(date);
    setCreatorOpen(true);
  }

  async function handleDeleteSlot(slotId: string) {
    if (!confirm("Delete this slot?")) return;
    await fetch(`/api/slots/${slotId}`, { method: "DELETE" });
    mutate();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Availability</h1>
          <p className="mt-1 text-sm text-gray-500">
            Click a day to add a time slot or hover a slot to delete it.
          </p>
        </div>
        <Button onClick={() => { setSelectedDate(undefined); setCreatorOpen(true); }}>
          + Add slot
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner className="h-8 w-8" />
        </div>
      ) : slots.length === 0 ? (
        <EmptyState
          title="No slots yet"
          description="Click '+ Add slot' or a day on the calendar to add your first availability."
          icon={<span className="text-5xl">📅</span>}
        />
      ) : null}

      {!isLoading && (
        <WeekCalendar
          slots={slots}
          onAddSlot={handleAddSlot}
          onDeleteSlot={handleDeleteSlot}
        />
      )}

      <SlotCreator
        open={creatorOpen}
        defaultDate={selectedDate}
        onClose={() => setCreatorOpen(false)}
        onCreated={mutate}
      />
    </div>
  );
}
