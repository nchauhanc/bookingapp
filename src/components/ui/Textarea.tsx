import { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export default function Textarea({ label, error, hint, id, className = "", ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={3}
        className={[
          "w-full resize-none rounded-xl border px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition",
          "focus:outline-none focus:ring-2 focus:ring-indigo-500/20",
          error
            ? "border-red-400 focus:border-red-400"
            : "border-gray-200 focus:border-indigo-500",
          className,
        ].join(" ")}
        {...props}
      />
      <div className="flex justify-between gap-2">
        {error ? (
          <p className="text-xs text-red-600">{error}</p>
        ) : hint ? (
          <p className="text-xs text-gray-400">{hint}</p>
        ) : (
          <span />
        )}
        {props.maxLength && typeof props.value === "string" && (
          <p className={[
            "text-xs tabular-nums",
            props.value.length > props.maxLength * 0.9 ? "text-orange-500" : "text-gray-400",
          ].join(" ")}>
            {props.value.length}/{props.maxLength}
          </p>
        )}
      </div>
    </div>
  );
}
