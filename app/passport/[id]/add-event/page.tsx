"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { industryConfig } from "@/lib/industry";

export default function AddEventPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const productId = params?.id ?? "";

  const [eventType, setEventType] = useState(industryConfig.eventTypes[0]?.value ?? "");
  const [actor, setActor] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [passcode, setPasscode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const canSubmit = useMemo(() => {
    return !submitting && !!productId && !!eventType && actor.trim() && passcode.trim();
  }, [submitting, productId, eventType, actor, passcode]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!canSubmit) {
      setError("Please select an event type and fill in actor and passcode.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          event_type: eventType,
          actor,
          location,
          notes,
          passcode,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error((data as { error?: string }).error || "Failed to add event.");
      }

      setSuccess(true);
      setActor("");
      setLocation("");
      setNotes("");
      setPasscode("");
      // Redirect to passport so the new event appears in the timeline.
      router.push(`/passport/${productId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add event.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-xl p-4 sm:p-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-teal-700">Update passport</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Add life-cycle event</h1>
        <p className="mt-1 text-sm text-slate-600">
          Record a new event for this product passport. Event types are defined by the <span className="font-medium">{industryConfig.name}</span> configuration.
        </p>

        <div className="mt-3 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
          <span className="font-medium text-slate-700">Product ID:</span>{" "}
          <span className="break-all font-mono">{productId || "—"}</span>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Event type *</label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-teal-500 focus:border-teal-500 focus:ring-1"
              required
            >
              {industryConfig.eventTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Actor *</label>
            <input
              value={actor}
              onChange={(e) => setActor(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-teal-500 focus:border-teal-500 focus:ring-1"
              placeholder="e.g. Factory A, Repair Center, Recycler"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Location</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-teal-500 focus:border-teal-500 focus:ring-1"
              placeholder="e.g. Berlin, DE"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-teal-500 focus:border-teal-500 focus:ring-1"
              placeholder="Optional details about this event"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Demo passcode *</label>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-teal-500 focus:border-teal-500 focus:ring-1"
              placeholder="Enter DEMO_PASSCODE"
              required
            />
            <p className="mt-1 text-xs text-slate-500">Required for write actions. Passports remain publicly readable.</p>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
          )}
          {success && !error && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              Event added. Redirecting to passport…
            </div>
          )}

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex flex-1 items-center justify-center rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Adding event..." : "Add event"}
            </button>
            <Link
              href={productId ? `/passport/${productId}` : "/"}
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
