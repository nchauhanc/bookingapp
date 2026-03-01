interface AvatarProps {
  name?: string | null;
  image?: string | null;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
};

function initials(name?: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Avatar({ name, image, size = "md" }: AvatarProps) {
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt={name ?? "user"}
        className={`${sizeClasses[size]} rounded-full object-cover`}
      />
    );
  }
  return (
    <div
      className={`${sizeClasses[size]} flex items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-600`}
    >
      {initials(name)}
    </div>
  );
}
