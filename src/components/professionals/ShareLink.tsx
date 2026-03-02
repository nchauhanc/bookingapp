"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";

interface ShareLinkProps {
  userId: string;
}

export default function ShareLink({ userId }: ShareLinkProps) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  // Build URL client-side so it uses the actual deployed origin
  useEffect(() => {
    setUrl(`${window.location.origin}/p/${userId}`);
  }, [userId]);

  async function handleCopy() {
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-2">
      <input
        readOnly
        value={url}
        className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-600 select-all truncate focus:outline-none"
        onClick={(e) => (e.target as HTMLInputElement).select()}
        aria-label="Your public booking link"
      />
      <Button variant="secondary" size="sm" onClick={handleCopy}>
        {copied ? "Copied ✓" : "Copy"}
      </Button>
    </div>
  );
}
