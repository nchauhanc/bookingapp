"use client";

import { useState } from "react";
import {
  startOfWeek,
  addDays,
  addWeeks,
  subWeeks,
  format,
  isSameDay,
  isToday,
} from "date-fns";
import SlotBadge from "./SlotBadge";
import Button from "@/components/ui/Button";

export interface WeekSlot {
  id: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

interface WeekCalendarProps {
  slots: WeekSlot[];
  // Professional mode: allows adding new slots
  onAddSlot?: (date: Date) => void;
  // Professional mode: allows deleting slots
  onDeleteSlot?: (slotId: string) => void;
  // Customer mode: click to book
  onBookSlot?: (slot: WeekSlot) => void;
}

export default function WeekCalendar({
  slots,
  onAddSlot,
  onDeleteSlot,
  onBookSlot,
}: WeekCalendarProps) {
  const [weekStart, setWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 }) // Monday
  );

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  function slotsForDay(day: Date) {
    return slots.filter((s) => isSameDay(new Date(s.startTime), day));
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Week navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setWeekStart(subWeeks(weekStart, 1))}
          aria-label="Previous week"
        >
          ← Prev
        </Button>
        <span className="text-sm font-semibold text-gray-700">
          {format(weekStart, "MMM d")} –{" "}
          {format(addDays(weekStart, 6), "MMM d, yyyy")}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setWeekStart(addWeeks(weekStart, 1))}
          aria-label="Next week"
        >
          Next →
        </Button>
      </div>

      {/* Calendar grid (horizontal scroll on mobile) */}
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="grid min-w-[560px] grid-cols-7 gap-2">
          {days.map((day) => {
            const daySlots = slotsForDay(day);
            const today = isToday(day);

            return (
              <div key={day.toISOString()} className="flex flex-col gap-2">
                {/* Day header */}
                <div
                  className={[
                    "rounded-xl py-2 text-center text-xs font-semibold",
                    today
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-600",
                  ].join(" ")}
                >
                  <span className="block">{format(day, "EEE")}</span>
                  <span className="text-base">{format(day, "d")}</span>
                </div>

                {/* Slots */}
                <div className="flex flex-col gap-1.5 min-h-[80px]">
                  {daySlots.map((slot) => (
                    <div key={slot.id} className="relative group">
                      <SlotBadge
                        startTime={slot.startTime}
                        endTime={slot.endTime}
                        isBooked={slot.isBooked}
                        onClick={
                          onBookSlot && !slot.isBooked
                            ? () => onBookSlot(slot)
                            : undefined
                        }
                      />
                      {/* Delete button for professional mode */}
                      {onDeleteSlot && !slot.isBooked && (
                        <button
                          onClick={() => onDeleteSlot(slot.id)}
                          className="absolute -top-1 -right-1 hidden group-hover:flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-[10px] hover:bg-red-600"
                          aria-label="Delete slot"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add slot button (professional mode) */}
                {onAddSlot && (
                  <button
                    onClick={() => onAddSlot(day)}
                    className="rounded-lg border-2 border-dashed border-gray-200 py-2 text-xs text-gray-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors"
                    aria-label={`Add slot on ${format(day, "EEE MMM d")}`}
                  >
                    + Add
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-gray-500 pt-1">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded bg-emerald-200 border border-emerald-300" />
          Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded bg-orange-200 border border-orange-300" />
          Booked
        </span>
      </div>
    </div>
  );
}
