"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import WeekCalendar, { WeekSlot } from "@/components/calendar/WeekCalendar";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import EmptyState from "@/components/ui/EmptyState";
import ErrorMessage from "@/components/ui/ErrorMessage";

interface Props {
  slots: WeekSlot[];
  professionalId: string;
  sessionRole: string | null;   // "PROFESSIONAL" | "CUSTOMER" | null
  sessionUserId: string | null;
}

export default function PublicBookingSection({
  slots,
  professionalId,
  sessionRole,
  sessionUserId,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentSlots, setCurrentSlots] = useState<WeekSlot[]>(slots);
  const [selectedSlot, setSelectedSlot] = useState<WeekSlot | null>(null);
  const [notes, setNotes] = useState("");
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // After login redirect: auto-open the modal if ?slot= is in the URL
  useEffect(() => {
    const slotId = searchParams.get("slot");
    if (slotId && sessionRole === "CUSTOMER") {
      const target = slots.find((s) => s.id === slotId && !s.isBooked);
      if (target) setSelectedSlot(target);
    }
  }, [searchParams, sessionRole, slots]);

  function handleSlotClick(slot: WeekSlot) {
    if (!sessionRole) {
      // Not logged in → send to login with full callback URL including slot id
      router.push(
        `/login?callbackUrl=${encodeURIComponent(`/p/${professionalId}?slot=${slot.id}`)}`
      );
      return;
    }
    if (sessionRole === "PROFESSIONAL") {
      // Professionals cannot book — show the notice via state
      setError("You are signed in as a professional. Sign in as a customer to book a slot.");
      return;
    }
    // CUSTOMER
    setSelectedSlot(slot);
    setError("");
  }

  async function handleConfirmBooking() {
    if (!selectedSlot) return;
    setError("");
    setBooking(true);

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slotId: selectedSlot.id, notes: notes || undefined }),
    });

    const data = await res.json();
    setBooking(false);

    if (!res.ok) {
      setError(data.error ?? "Booking failed");
      return;
    }

    // Remove the booked slot from the local list
    setCurrentSlots((prev) => prev.filter((s) => s.id !== selectedSlot.id));
    setSelectedSlot(null);
    setNotes("");
    setSuccess(true);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Role notice for professionals */}
      {error && !selectedSlot && (
        <div className="rounded-xl bg-yellow-50 border border-yellow-200 px-4 py-3 text-sm text-yellow-800">
          {error}
        </div>
      )}

      {/* Success banner */}
      {success && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
          Booking confirmed!{" "}
          {sessionRole === "CUSTOMER" && (
            <a href="/customer/bookings" className="underline font-medium">
              View in My Bookings →
            </a>
          )}
        </div>
      )}

      {/* Unauthenticated hint */}
      {!sessionRole && (
        <p className="text-sm text-gray-500">
          Click an available slot to book.{" "}
          <a href="/login" className="text-indigo-600 hover:underline font-medium">
            Sign in
          </a>{" "}
          or{" "}
          <a href="/register" className="text-indigo-600 hover:underline font-medium">
            create a free account
          </a>{" "}
          to complete your booking.
        </p>
      )}

      {currentSlots.length === 0 && !success ? (
        <EmptyState
          title="No available slots"
          description="This professional has no upcoming available slots."
          icon={<span className="text-5xl">📅</span>}
        />
      ) : (
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm ring-1 ring-gray-200">
          <WeekCalendar slots={currentSlots} onBookSlot={handleSlotClick} />
        </div>
      )}

      {/* Booking confirmation modal */}
      <Modal
        open={!!selectedSlot}
        onClose={() => { setSelectedSlot(null); setError(""); }}
        title="Confirm Booking"
      >
        {selectedSlot && (
          <div className="flex flex-col gap-4">
            {error && <ErrorMessage message={error} />}
            <div className="rounded-xl bg-gray-50 p-4 text-sm">
              <p className="font-semibold text-gray-800">
                {format(new Date(selectedSlot.startTime), "EEEE, MMMM d")}
              </p>
              <p className="text-gray-600">
                {format(new Date(selectedSlot.startTime), "HH:mm")} –{" "}
                {format(new Date(selectedSlot.endTime), "HH:mm")}
              </p>
            </div>
            <Input
              label="Note for the professional (optional)"
              id="public-booking-notes"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special request…"
              maxLength={500}
            />
            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => { setSelectedSlot(null); setError(""); }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                loading={booking}
                onClick={handleConfirmBooking}
              >
                Confirm
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
