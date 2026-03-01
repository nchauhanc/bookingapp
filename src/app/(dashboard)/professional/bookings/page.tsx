"use client";

import { format } from "date-fns";
import { useBookings } from "@/hooks/useBookings";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import type { BookingPublic } from "@/types";

export default function ProfessionalBookingsPage() {
  const { bookings, isLoading } = useBookings("professional");

  const upcoming = bookings.filter(
    (b) => new Date(b.slot.startTime) >= new Date()
  );
  const past = bookings.filter((b) => new Date(b.slot.startTime) < new Date());

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Customers who have booked your slots.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner className="h-8 w-8" />
        </div>
      ) : bookings.length === 0 ? (
        <EmptyState
          title="No bookings yet"
          description="Once customers book your slots, they'll appear here."
          icon={<span className="text-5xl">📋</span>}
        />
      ) : (
        <>
          {upcoming.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                Upcoming ({upcoming.length})
              </h2>
              <BookingList bookings={upcoming} />
            </section>
          )}
          {past.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                Past ({past.length})
              </h2>
              <BookingList bookings={past} dimmed />
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
}: {
  bookings: BookingPublic[];
  dimmed?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3">
      {bookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} dimmed={dimmed} />
      ))}
    </div>
  );
}

function BookingCard({
  booking,
  dimmed,
}: {
  booking: BookingPublic;
  dimmed?: boolean;
}) {
  const slot = booking.slot;
  const customer = booking.customer;
  const start = new Date(slot.startTime);
  const end = new Date(slot.endTime);

  return (
    <div
      className={[
        "flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200",
        dimmed ? "opacity-60" : "",
      ].join(" ")}
    >
      <Avatar name={customer.name} image={customer.image} size="md" />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 truncate">
          {customer.name ?? customer.email}
        </p>
        <p className="text-sm text-gray-500">{customer.email}</p>
        {booking.notes && (
          <p className="mt-1 text-xs text-gray-400 italic">"{booking.notes}"</p>
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
      </div>
    </div>
  );
}
