import { redirect } from "next/navigation";

/**
 * Root fallback: if a request for "/" somehow bypasses the next.config
 * redirect (e.g. during static generation or edge cases), redirect to /en.
 */
export default function RootPage() {
  redirect("/en");
}
