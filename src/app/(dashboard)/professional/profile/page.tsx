"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Spinner from "@/components/ui/Spinner";

interface ProfileData {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  speciality: string | null;
  tagline: string | null;
  bio: string | null;
  role: string;
}

export default function ProfilePage() {
  const { data: session, update: updateSession } = useSession();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  // form state
  const [name, setName] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [tagline, setTagline] = useState("");
  const [bio, setBio] = useState("");

  // save state
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Load profile on mount
  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data: ProfileData) => {
        setProfile(data);
        setName(data.name ?? "");
        setSpeciality(data.speciality ?? "");
        setTagline(data.tagline ?? "");
        setBio(data.bio ?? "");
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setError("");
    setSuccess(false);
    setSaving(true);

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, speciality, tagline, bio }),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error ?? "Failed to save profile");
      return;
    }

    setProfile(data);
    // Update the NextAuth session so the name in the header updates too
    await updateSession({ name: data.name });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 4000);
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="mt-1 text-sm text-gray-500">
          Customise how you appear to customers on your public booking page.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* ── Form ── */}
        <div className="lg:col-span-3 flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Edit details
          </h2>

          {/* Success / error banners */}
          {success && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
              ✅ Profile saved!
            </div>
          )}
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <Input
            id="profile-name"
            label="Display name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            maxLength={80}
          />

          <Input
            id="profile-speciality"
            label="Title / speciality"
            value={speciality}
            onChange={(e) => setSpeciality(e.target.value)}
            placeholder="e.g. Badminton Coach, Personal Trainer, Tutor"
            maxLength={60}
          />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="profile-tagline" className="text-sm font-medium text-gray-700">
              Tagline
            </label>
            <Input
              id="profile-tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Helping you move better, one session at a time"
              maxLength={100}
            />
            <div className="flex justify-between">
              <p className="text-xs text-gray-400">Shown under your name on your public page.</p>
              <p className={["text-xs tabular-nums", tagline.length > 90 ? "text-orange-500" : "text-gray-400"].join(" ")}>
                {tagline.length}/100
              </p>
            </div>
          </div>

          <Textarea
            id="profile-bio"
            label="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell customers about your experience, qualifications, and what to expect from a session with you…"
            rows={5}
            maxLength={600}
            hint="Appears on your public booking page."
          />

          <div className="pt-1">
            <Button onClick={handleSave} loading={saving}>
              Save changes
            </Button>
          </div>
        </div>

        {/* ── Live preview ── */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Preview
          </h2>
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
            <p className="mb-3 text-xs text-gray-400 font-medium">
              How customers see your profile
            </p>
            <div className="flex items-start gap-3">
              <Avatar name={name || profile?.name} image={profile?.image} size="lg" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-base leading-snug">
                  {name || <span className="text-gray-300 italic">Your name</span>}
                </p>
                {speciality ? (
                  <div className="mt-1">
                    <Badge label={speciality} variant="blue" />
                  </div>
                ) : null}
                {tagline ? (
                  <p className="mt-1.5 text-sm text-gray-500 italic leading-snug">
                    &ldquo;{tagline}&rdquo;
                  </p>
                ) : null}
                {bio ? (
                  <p className="mt-2 text-sm text-gray-500 leading-relaxed line-clamp-4">
                    {bio}
                  </p>
                ) : null}
                {!speciality && !tagline && !bio && (
                  <p className="mt-1 text-xs text-gray-300 italic">
                    Fill in the fields on the left to see a preview.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Link to public page */}
          {profile?.id && (
            <a
              href={`/p/${profile.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:underline font-medium"
            >
              <span>🔗</span> View your public page →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
