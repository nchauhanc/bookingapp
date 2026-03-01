import { format } from "date-fns";

interface SlotBadgeProps {
  startTime: string;
  endTime: string;
  isBooked: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export default function SlotBadge({
  startTime,
  endTime,
  isBooked,
  onClick,
  disabled = false,
}: SlotBadgeProps) {
  const start = new Date(startTime);
  const end = new Date(endTime);

  return (
    <button
      onClick={onClick}
      disabled={disabled || !onClick}
      className={[
        "w-full rounded-lg px-3 py-2 text-left text-xs font-medium transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
        isBooked
          ? "bg-orange-100 text-orange-700 border border-orange-200 cursor-default"
          : onClick && !disabled
          ? "bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-200 focus-visible:ring-emerald-500 cursor-pointer"
          : "bg-emerald-50 text-emerald-600 border border-emerald-100 cursor-default",
      ].join(" ")}
    >
      <span className="block font-semibold">{format(start, "HH:mm")}</span>
      <span className="text-[10px] opacity-75">
        – {format(end, "HH:mm")} · {isBooked ? "Booked" : "Available"}
      </span>
    </button>
  );
}
