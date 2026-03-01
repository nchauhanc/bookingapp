import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function CustomerDashboard() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  const [totalBookings, upcomingBookings] = await Promise.all([
    prisma.booking.count({
      where: { customerId: session.user.id, status: "CONFIRMED" },
    }),
    prisma.booking.count({
      where: {
        customerId: session.user.id,
        status: "CONFIRMED",
        slot: { startTime: { gte: new Date() } },
      },
    }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {session.user.name ?? "there"}!
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Browse professionals and book your appointments.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <p className="text-sm font-medium text-gray-500">Upcoming Bookings</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{upcomingBookings}</p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <p className="text-sm font-medium text-gray-500">Total Bookings</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{totalBookings}</p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/customer/browse"
          className="flex items-center gap-4 rounded-2xl bg-indigo-600 p-6 text-white hover:bg-indigo-700 transition-colors"
        >
          <span className="text-3xl">🔍</span>
          <div>
            <p className="font-semibold">Browse Professionals</p>
            <p className="text-sm text-indigo-200">Find and book a service</p>
          </div>
        </Link>
        <Link
          href="/customer/bookings"
          className="flex items-center gap-4 rounded-2xl bg-white p-6 ring-1 ring-gray-200 hover:bg-gray-50 transition-colors"
        >
          <span className="text-3xl">📋</span>
          <div>
            <p className="font-semibold text-gray-900">My Bookings</p>
            <p className="text-sm text-gray-500">View & cancel appointments</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
