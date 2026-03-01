"use client";

import { useState } from "react";
import { format } from "date-fns";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ErrorMessage from "@/components/ui/ErrorMessage";

interface SlotCreatorProps {
  open: boolean;
  defaultDate?: Date;
  onClose: () => void;
  onCreated: () => void;
}

export default function SlotCreator({
  open,
  defaultDate,
  onClose,
  onCreated,
}: SlotCreatorProps) {
  const dateStr = defaultDate
    ? format(defaultDate, "yyyy-MM-dd")
    : format(new Date(), "yyyy-MM-dd");

  const [date, setDate] = useState(dateStr);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const startISO = new Date(`${date}T${startTime}:00`).toISOString();
    const endISO = new Date(`${date}T${endTime}:00`).toISOString();

    const res = await fetch("/api/slots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startTime: startISO, endTime: endISO }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Failed to create slot");
      return;
    }

    onCreated();
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Add availability slot">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && <ErrorMessage message={error} />}
        <Input
          label="Date"
          id="slot-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          min={format(new Date(), "yyyy-MM-dd")}
          required
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Start time"
            id="start-time"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
          <Input
            label="End time"
            id="end-time"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button type="submit" className="flex-1" loading={loading}>
            Add slot
          </Button>
        </div>
      </form>
    </Modal>
  );
}
