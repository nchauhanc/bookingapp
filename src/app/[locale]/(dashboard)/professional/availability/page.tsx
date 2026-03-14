"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import WeekCalendar from "@/components/calendar/WeekCalendar";
import SlotCreator from "@/components/calendar/SlotCreator";
import RecurringCreator from "@/components/calendar/RecurringCreator";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import { useProfessionalSlots } from "@/hooks/useSlots";

export default function AvailabilityPage() {
  const { data: session } = useSession();
  const { slots, isLoading, mutate } = useProfessionalSlots(session?.user?.id);
  const t = useTranslations("Availability");

  const [creatorOpen,   setCreatorOpen]   = useState(false);
  const [recurringOpen, setRecurringOpen] = useState(false);
  const [selectedDate,  setSelectedDate]  = useState<Date | undefined>();
  const [banner, setBanner] = useState<{ created: number; skipped: number } | null>(null);

  // Auto-dismiss the success banner after 6 seconds
  useEffect(() => {
    if (!banner) return;
    const timer = setTimeout(() => setBanner(null), 6000);
    return () => clearTimeout(timer);
  }, [banner]);

  function handleAddSlot(date: Date) {
    setSelectedDate(date);
    setCreatorOpen(true);
  }

  async function handleDeleteSlot(slotId: string) {
    if (!confirm(t("deleteConfirm"))) return;
    await fetch(`/api/slots/${slotId}`, { method: "DELETE" });
    mutate();
  }

  function handleRecurringCreated(result: { created: number; skipped: number }) {
    setBanner(result);
    mutate();
  }

  function getBannerText(created: number) {
    if (created === 0) return t("banner.zero");
    if (created === 1) return t("banner.created", { count: created });
    return t("banner.createdPlural", { count: created });
  }

  return (
    <div className="flex flex-col gap-6">

      {/* ── Header ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
          <p className="mt-1 hidden text-sm text-gray-500 sm:block">
            {t("desc")}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setRecurringOpen(true)}
          >
            {t("weeklyBtn")}
          </Button>
          <Button
            size="sm"
            onClick={() => { setSelectedDate(undefined); setCreatorOpen(true); }}
          >
            {t("addSlotBtn")}
          </Button>
        </div>
      </div>

      {/* ── Success banner (auto-dismisses) ── */}
      {banner && (
        <div className="flex items-start gap-2.5 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800 ring-1 ring-green-200">
          <span className="mt-0.5 text-base">✅</span>
          <span>
            <span className="font-semibold">
              {getBannerText(banner.created)}
            </span>
            {banner.skipped > 0 && (
              <span className="text-green-700">
                {" "}{t("banner.skipped", { count: banner.skipped })}
              </span>
            )}
          </span>
          <button
            onClick={() => setBanner(null)}
            className="ml-auto text-green-500 hover:text-green-700"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── Loading / empty states ── */}
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
      ) : null}

      {/* ── Calendar ── */}
      {!isLoading && (
        <WeekCalendar
          slots={slots}
          onAddSlot={handleAddSlot}
          onDeleteSlot={handleDeleteSlot}
        />
      )}

      {/* ── Modals ── */}
      <SlotCreator
        open={creatorOpen}
        defaultDate={selectedDate}
        onClose={() => setCreatorOpen(false)}
        onCreated={mutate}
      />

      <RecurringCreator
        open={recurringOpen}
        onClose={() => setRecurringOpen(false)}
        onCreated={handleRecurringCreated}
      />

    </div>
  );
}
