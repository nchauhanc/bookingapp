"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useBookings } from "@/hooks/useBookings";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import type { BookingPublic } from "@/types";

export default function CustomerBookingsPage() {
  const { bookings, isLoading, mutate } = useBookings();

  const upcoming = bookings.filter(
    (b) => b.status === "CONFIRMED" && new Date(b.slot.startTime) >= new Date()
  );
  const past = bookings.filter(
    (b) => b.status !== "CONFIRMED" || new Date(b.slot.startTime) < new Date()
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your appointments.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner className="h-8 w-8" />
        </div>
      ) : bookings.length === 0 ? (
        <EmptyState
          title="No bookings yet"
          description="Browse professionals and book your first appointment."
          icon={<span className="text-5xl">📋</span>}
        />
      ) : (
        <>
          {upcoming.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                Upcoming ({upcoming.length})
              </h2>
              <BookingList bookings={upcoming} onMutate={mutate} />
            </section>
          )}
          {past.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                Past ({past.length})
              </h2>
              <BookingList bookings={past} dimmed onMutate={mutate} />
            </section>
          )}
        </>
      )}
    </div>
  );
}

function BookingList({
  bookings,
  dimmed = false,
  onMutate,
}: {
  bookings: BookingPublic[];
  dimmed?: boolean;
  onMutate: () => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {bookings.map((booking) => (
        <BookingCard
          key={booking.id}
          booking={booking}
          dimmed={dimmed}
          onMutate={onMutate}
        />
      ))}
    </div>
  );
}

function BookingCard({
  booking,
  dimmed,
  onMutate,
}: {
  booking: BookingPublic;
  dimmed?: boolean;
  onMutate: () => void;
}) {
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const slot = booking.slot;
  const professional = slot.professional;
  const start = new Date(slot.startTime);
  const end = new Date(slot.endTime);
  const isUpcoming =
    booking.status === "CONFIRMED" && start >= new Date();

  async function handleCancel() {
    setCancelling(true);
    await fetch(`/api/bookings/${booking.id}`, { method: "DELETE" });
    setCancelling(false);
    setCancelOpen(false);
    onMutate();
  }

  return (
    <>
      <div
        className={[
          "flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200",
          dimmed ? "opacity-60" : "",
        ].join(" ")}
      >
        <Avatar
          name={professional.name}
          image={professional.image}
          size="md"
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate">
            {professional.name ?? professional.email}
          </p>
          {professional.speciality && (
            <Badge label={professional.speciality} variant="blue" />
          )}
          {booking.notes && (
            <div className="mt-2 flex items-start gap-1.5 rounded-lg bg-gray-50 px-2.5 py-1.5 ring-1 ring-gray-100">
              <span className="mt-0.5 shrink-0 text-xs">📝</span>
              <p className="text-xs text-gray-600 leading-relaxed">{booking.notes}</p>
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge
            label={booking.status === "CONFIRMED" ? "Confirmed" : "Cancelled"}
            variant={booking.status === "CONFIRMED" ? "green" : "red"}
          />
          <p className="text-sm font-medium text-gray-700">
            {format(start, "EEE, MMM d")}
          </p>
          <p className="text-xs text-gray-500">
            {format(start, "HH:mm")} – {format(end, "HH:mm")}
          </p>
          {isUpcoming && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => setCancelOpen(true)}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>

      <Modal
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        title="Cancel booking?"
      >
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to cancel your appointment on{" "}
          <strong>{format(start, "EEEE, MMMM d")}</strong> at{" "}
          <strong>{format(start, "HH:mm")}</strong>? This cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => setCancelOpen(false)}
          >
            Keep it
          </Button>
          <Button
            variant="danger"
            className="flex-1"
            loading={cancelling}
            onClick={handleCancel}
          >
            Cancel booking
          </Button>
        </div>
      </Modal>
    </>
  );
}
