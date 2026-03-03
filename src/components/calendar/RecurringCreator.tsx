"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

interface RecurringCreatorProps {
  open: boolean;
  onClose: () => void;
  onCreated: (result: { created: number; skipped: number }) => void;
}

// Day labels — index matches JS Date.getDay() (0=Sun … 6=Sat)
const DAYS = [
  { label: "Sun", value: 0 },
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
];

const DURATIONS = [
  { label: "30 min", value: 30 },
  { label: "45 min", value: 45 },
  { label: "60 min", value: 60 },
  { label: "90 min", value: 90 },
  { label: "2 hr",   value: 120 },
];

const WEEKS = [1, 2, 4, 8, 12];

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function previewCount(
  days: number[],
  startTime: string,
  endTime: string,
  duration: number,
  weeks: number
): number {
  if (days.length === 0 || !startTime || !endTime || endTime <= startTime) return 0;
  const windowMins = toMinutes(endTime) - toMinutes(startTime);
  if (windowMins <= 0 || duration <= 0) return 0;
  const slotsPerDay = Math.floor(windowMins / duration);
  return days.length * weeks * slotsPerDay;
}

export default function RecurringCreator({ open, onClose, onCreated }: RecurringCreatorProps) {
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [startTime,    setStartTime]    = useState("09:00");
  const [endTime,      setEndTime]      = useState("17:00");
  const [duration,     setDuration]     = useState(60);
  const [weeksAhead,   setWeeksAhead]   = useState(4);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");

  function toggleDay(day: number) {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  }

  const preview = previewCount(selectedDays, startTime, endTime, duration, weeksAhead);

  const dayLabels = DAYS.filter((d) => selectedDays.includes(d.value))
    .map((d) => d.label)
    .join(" · ");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (selectedDays.length === 0) {
      setError("Please select at least one day.");
      return;
    }
    if (endTime <= startTime) {
      setError("End time must be after start time.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/slots/recurring", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ days: selectedDays, startTime, endTime, durationMinutes: duration, weeksAhead }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Something went wrong.");
      return;
    }

    onCreated(data as { created: number; skipped: number });
    onClose();
  }

  function handleClose() {
    if (!loading) onClose();
  }

  // ── Shared pill class helpers ──────────────────────────────────────────────
  function dayPill(active: boolean) {
    return [
      "flex h-10 w-12 cursor-pointer select-none items-center justify-center rounded-xl text-sm font-semibold transition-colors",
      active
        ? "bg-indigo-600 text-white shadow-sm"
        : "border border-gray-200 text-gray-500 hover:border-indigo-300 hover:text-indigo-600",
    ].join(" ");
  }

  function optionPill(active: boolean) {
    return [
      "cursor-pointer select-none rounded-xl border px-3 py-1.5 text-sm font-medium transition-colors",
      active
        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
        : "border-gray-200 text-gray-500 hover:border-indigo-300 hover:text-indigo-600",
    ].join(" ");
  }

  return (
    <Modal open={open} onClose={handleClose} title="📅 Set weekly schedule">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        {/* ── Days of week ── */}
        <div>
          <p className="mb-2 text-sm font-medium text-gray-700">Available days</p>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => toggleDay(d.value)}
                className={dayPill(selectedDays.includes(d.value))}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Time window ── */}
        <div>
          <p className="mb-2 text-sm font-medium text-gray-700">
            Hours <span className="font-normal text-gray-400">(same for all selected days)</span>
          </p>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">From</span>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">To</span>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </label>
          </div>
        </div>

        {/* ── Session duration ── */}
        <div>
          <p className="mb-2 text-sm font-medium text-gray-700">Session duration</p>
          <div className="flex flex-wrap gap-2">
            {DURATIONS.map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => setDuration(d.value)}
                className={optionPill(duration === d.value)}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Weeks ahead ── */}
        <div>
          <p className="mb-2 text-sm font-medium text-gray-700">Generate for the next</p>
          <div className="flex flex-wrap gap-2">
            {WEEKS.map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setWeeksAhead(w)}
                className={optionPill(weeksAhead === w)}
              >
                {w} {w === 1 ? "week" : "weeks"}
              </button>
            ))}
          </div>
        </div>

        {/* ── Live preview ── */}
        <div className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
          {preview > 0 ? (
            <>
              <span className="font-semibold text-indigo-700">📊 Up to {preview} slots</span>
              {dayLabels && (
                <span className="text-gray-500">
                  {" "}· {dayLabels} · {weeksAhead} {weeksAhead === 1 ? "week" : "weeks"}
                </span>
              )}
              <p className="mt-0.5 text-xs text-gray-400">
                Slots that already exist will be skipped automatically.
              </p>
            </>
          ) : (
            <span className="text-gray-400">
              Select days and a valid time window to see a preview.
            </span>
          )}
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>
        )}

        {/* ── Actions ── */}
        <div className="flex gap-3 pt-1">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            loading={loading}
            disabled={preview === 0}
          >
            Generate slots →
          </Button>
        </div>

      </form>
    </Modal>
  );
}
