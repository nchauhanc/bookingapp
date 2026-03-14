"use client";

import { useState } from "react";
import { use } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAvailableSlots } from "@/hooks/useSlots";
import WeekCalendar, { WeekSlot } from "@/components/calendar/WeekCalendar";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { format } from "date-fns";

interface Props {
  params: Promise<{ professionalId: string }>;
}

export default function BookPage({ params }: Props) {
  const { professionalId } = use(params);
  const { slots, isLoading, mutate } = useAvailableSlots(professionalId);
  const t = useTranslations("BookPage");

  const [selectedSlot, setSelectedSlot] = useState<WeekSlot | null>(null);
  const [notes, setNotes] = useState("");
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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

    setSuccess(true);
    setSelectedSlot(null);
    setNotes("");
    mutate();
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
        <p className="mt-1 text-sm text-gray-500">
          {t("subtitle")}
        </p>
      </div>

      {success && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
          {t("success")}{" "}
          <Link href="/customer/bookings" className="underline font-medium">
            {t("successLink")}
          </Link>
          .
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner className="h-8 w-8" />
        </div>
      ) : slots.length === 0 ? (
        <EmptyState
          title={t("empty.title")}
          description={t("empty.desc")}
          icon={<span className="text-5xl">📅</span>}
        />
      ) : (
        <WeekCalendar
          slots={slots}
          onBookVra={(slot) => {
            setSelectedSlot(slot);
            setSuccess(false);
          }}
        />
      )}

      {/* Booking confirmation modal */}
      <Modal
        open={!!selectedSlot}
        onClose={() => setSelectedSlot(null)}
        title={t("modal.title")}
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

            <Textarea
              label={t("modal.noteLabel")}
              id="booking-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("modal.notePlaceholder")}
              maxLength={500}
              hint={t("modal.noteHint")}
            />

            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setSelectedSlot(null)}
              >
                {t("modal.cancel")}
              </Button>
              <Button
                className="flex-1"
                loading={booking}
                onClick={handleConfirmBooking}
              >
                {t("modal.confirm")}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
