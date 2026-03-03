import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ShareLink from "@/components/professionals/ShareLink";

export default async function ProfessionalDashboard() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  const [totalSlots, bookedSlots, upcomingBookings, userRecord] = await Promise.all([
    prisma.slot.count({ where: { professionalId: session.user.id } }),
    prisma.slot.count({
      where: { professionalId: session.user.id, isBooked: true },
    }),
    prisma.booking.count({
      where: {
        slot: {
          professionalId: session.user.id,
          startTime: { gte: new Date() },
        },
        status: "CONFIRMED",
      },
    }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { username: true },
    }),
  ]);

  const stats = [
    { label: "Total Slots", value: totalSlots, color: "indigo" },
    { label: "Booked Slots", value: bookedSlots, color: "orange" },
    { label: "Upcoming Bookings", value: upcomingBookings, color: "emerald" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {session.user.name ?? "Professional"}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your availability and track bookings.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200"
          >
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/professional/availability"
          className="flex items-center gap-4 rounded-2xl bg-indigo-600 p-6 text-white hover:bg-indigo-700 transition-colors"
        >
          <span className="text-3xl">📅</span>
          <div>
            <p className="font-semibold">Manage Availability</p>
            <p className="text-sm text-indigo-200">Add or remove time slots</p>
          </div>
        </Link>
        <Link
          href="/professional/bookings"
          className="flex items-center gap-4 rounded-2xl bg-white p-6 ring-1 ring-gray-200 hover:bg-gray-50 transition-colors"
        >
          <span className="text-3xl">📋</span>
          <div>
            <p className="font-semibold text-gray-900">View Bookings</p>
            <p className="text-sm text-gray-500">See customer appointments</p>
          </div>
        </Link>
      </div>

      {/* Share your schedule */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <p className="font-semibold text-gray-900 mb-1">🔗 Share your schedule</p>
        <p className="text-sm text-gray-500 mb-3">
          Send this link to customers — they can browse your slots and book directly.
        </p>
        <ShareLink userId={session.user.id} username={userRecord?.username ?? null} />
      </div>
    </div>
  );
}
