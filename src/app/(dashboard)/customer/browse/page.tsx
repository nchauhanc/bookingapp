"use client";

import { useState } from "react";
import Link from "next/link";
import { useProfessionals } from "@/hooks/useProfessionals";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import Spinner from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import type { UserPublic } from "@/types";

export default function BrowsePage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { professionals, isLoading } = useProfessionals(debouncedSearch);

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    // Simple debounce with timeout
    clearTimeout((window as unknown as { _searchTimer?: ReturnType<typeof setTimeout> })._searchTimer);
    (window as unknown as { _searchTimer?: ReturnType<typeof setTimeout> })._searchTimer = setTimeout(
      () => setDebouncedSearch(e.target.value),
      300
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Browse Professionals</h1>
        <p className="mt-1 text-sm text-gray-500">
          Find a professional and book an available slot.
        </p>
      </div>

      <Input
        id="search"
        placeholder="Search by name or speciality…"
        value={search}
        onChange={handleSearchChange}
        className="max-w-sm"
      />

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner className="h-8 w-8" />
        </div>
      ) : professionals.length === 0 ? (
        <EmptyState
          title="No professionals found"
          description={search ? `No results for "${search}"` : "No professionals registered yet."}
          icon={<span className="text-5xl">🔍</span>}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {professionals.map((pro) => (
            <ProfessionalCard key={pro.id} professional={pro} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProfessionalCard({ professional }: { professional: UserPublic }) {
  return (
    <Link href={`/customer/book/${professional.id}`}>
      <div className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200 hover:shadow-md hover:ring-indigo-200 transition-all cursor-pointer h-full">
        <div className="flex items-center gap-3">
          <Avatar name={professional.name} image={professional.image} size="lg" />
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 truncate">
              {professional.name ?? "Professional"}
            </p>
            {professional.speciality && (
              <Badge label={professional.speciality} variant="blue" />
            )}
          </div>
        </div>
        {professional.bio && (
          <p className="text-sm text-gray-500 line-clamp-2">{professional.bio}</p>
        )}
        <div className="mt-auto pt-2">
          <span className="text-sm font-medium text-indigo-600 hover:underline">
            View availability →
          </span>
        </div>
      </div>
    </Link>
  );
}
