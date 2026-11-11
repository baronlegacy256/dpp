"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { getEventTypeConfig, type IndustryConfig, type IndustryId } from "@/lib/industry";
import type { ProductEvent } from "@/lib/types";
import QrCard from "./QrCard";

type Audience = "consumer" | "repairer" | "regulator";

type Material = { name?: string; origin_country?: string };

export default function PassportView(props: {
  product: {
    id: string;
    name: string;
    model: string;
    manufacturer: string;
    created_at: string;
  };
  attributes: Record<string, unknown>;
  industryId: IndustryId;
  industry: IndustryConfig;
  events: ProductEvent[];
  qrDataUrl: string | null;
}) {
  const { product, attributes, industryId, industry, events, qrDataUrl } = props;
  const [audience, setAudience] = useState<Audience>("consumer");

  const latestEvent = events[0] ?? null;
  const status = getStatus(latestEvent?.event_type ?? null);
  const countries = Array.from(
    new Set(
      events
        .map((e) => (e.location || "").split(",").pop()?.trim())
        .filter((c): c is string => !!c)
    )
  );
  const lastUpdated = latestEvent?.created_at ?? product.created_at;

  const recycled = attributes.recycled_content_pct;
  const carbon = attributes.carbon_footprint_kg;
  const repairability = attributes.repairability_score;
  const materials = Array.isArray(attributes.materials) ? (attributes.materials as Material[]) : [];
  const compliance = typeof attributes.compliance_status === "string" ? attributes.compliance_status : null;

  const route = useMemo(() => {
    const asc = [...events].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    const locs = asc.map((e) => (e.location || "").trim()).filter(Boolean);
    const compact: string[] = [];
    for (const loc of locs) if (compact[compact.length - 1] !== loc) compact.push(loc);
    return compact;
  }, [events]);

  const showMaterials = audience === "repairer" || audience === "regulator";
  const showCompliance = audience === "regulator";
  const showFullEventDetails = audience === "regulator";
  const showRepairerExtras = audience === "repairer";
  const showTimeline = true;

  return (
    <div className="space-y-4 sm:space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Audience view</h2>
            <p className="mt-1 text-xs text-slate-600">Preview what different stakeholders need to see. In real deployments, access would be enforced with role-based access control and data minimization.</p>
          </div>
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
            {([
              ["consumer", "Consumer"],
              ["repairer", "Repairer"],
              ["regulator", "Regulator"],
            ] as const).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setAudience(key)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${audience === key ? "bg-white text-teal-700 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
                aria-pressed={audience === key}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
              <IndustryIcon industry={industryId} />
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-teal-700">TracePass · {industry.name} passport</p>
              <h1 className="mt-1 text-2xl font-semibold text-slate-900">{product.name}</h1>
              <p className="mt-1 text-sm text-slate-600">{product.model} · {product.manufacturer}</p>
            </div>
          </div>
          <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}>{status.label}</span>
        </div>
        <p className="mt-4 text-sm text-slate-700">
          <span className="font-medium text-slate-900">{events.length}</span> event{events.length === 1 ? "" : "s"} · <span className="font-medium text-slate-900">{countries.length}</span> countr{countries.length === 1 ? "y" : "ies"} · Last updated <span className="font-medium text-slate-900">{formatDate(lastUpdated)}</span>
        </p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Sustainability</h2>
        <p className="mt-1 text-sm text-slate-600">Key environmental indicators reported for this product (demo data).</p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Recycled content</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{recycled !== undefined && recycled !== null ? `${recycled}%` : "—"}</p>
            {typeof recycled === "number" && (
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-teal-600" style={{ width: `${Math.max(0, Math.min(100, recycled))}%` }} /></div>
            )}
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Carbon footprint</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{carbon !== undefined && carbon !== null ? `${carbon} kg` : "—"}</p>
            <p className="mt-1 text-xs text-slate-500">CO₂e (reported)</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Repairability score</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">{repairability !== undefined && repairability !== null ? `${repairability}/10` : "—"}</p>
            {typeof repairability === "number" && (
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-teal-600" style={{ width: `${Math.max(0, Math.min(100, (repairability / 10) * 100))}%` }} /></div>
            )}
            {showRepairerExtras && typeof repairability === "number" && (
              <p className="mt-2 text-xs text-slate-600">Higher scores indicate easier disassembly and spare-part access (demo metric).</p>
            )}
          </div>
        </div>
      </section>

      {showMaterials && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">Materials</h2>
          <p className="mt-1 text-sm text-slate-600">Declared materials and origin countries.</p>
          {materials.length > 0 ? (
            <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {materials.map((m, i) => (
                <li key={`${m.name}-${i}`} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                  <span className="font-medium text-slate-900">{m.name || "Material"}</span>
                  <span className="text-slate-600">{m.origin_country || "—"}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-slate-600">No materials recorded.</p>
          )}
        </section>
      )}

      {showCompliance && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-semibold text-slate-900">Compliance</h2>
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">Demo data</span>
          </div>
          <p className="mt-2 text-sm text-slate-700">{compliance || "No compliance information recorded."}</p>
          <p className="mt-2 text-xs text-slate-500">Compliance information shown here is sample data for demonstration only and not a legal declaration.</p>
        </section>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Product details</h2>
        <p className="mt-1 text-xs text-slate-500">Industry profile: {industry.name}</p>
        <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {industry.productFields.map((field) => (
            <div key={field.key} className="rounded-lg bg-slate-50 p-3">
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{field.label}</dt>
              <dd className="mt-1 text-sm font-medium text-slate-900">{getAttributeDisplay(attributes[field.key])}</dd>
            </div>
          ))}
          <div className="rounded-lg bg-slate-50 p-3 sm:col-span-2">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Product ID</dt>
            <dd className="mt-1 break-all font-mono text-xs text-slate-800">{product.id}</dd>
          </div>
        </dl>
      </section>

      <QrCard qrDataUrl={qrDataUrl} productName={product.name} productId={product.id} />

      {showTimeline && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Life-cycle timeline</h2>
              <p className="mt-1 text-xs text-slate-500">Newest events first</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700">
                {events.length} event{events.length === 1 ? "" : "s"}
              </span>
              <Link href={`/passport/${product.id}/add-event`} className="inline-flex items-center justify-center rounded-lg border border-teal-200 bg-white px-3 py-1.5 text-xs font-medium text-teal-700 hover:bg-teal-50">Add event</Link>
            </div>
          </div>

          {route.length > 0 && (
            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Route</p>
              <p className="mt-1 text-sm text-slate-800">{route.join(" → ")}</p>
            </div>
          )}

          {events.length === 0 ? (
            <p className="mt-4 rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-600">No events recorded for this product yet.</p>
          ) : (
            <ol className="mt-5 space-y-4">
              {events.map((event, index) => {
                const typeConfig = getEventTypeConfig(event.event_type, industryId);
                const isLast = index === events.length - 1;
                return (
                  <li key={event.id} className="relative pl-10">
                    {!isLast && <span className="absolute left-[13px] top-7 h-[calc(100%+0.25rem)] w-px bg-slate-200" aria-hidden="true" />}
                    <span className={`absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-white ring-1 ring-slate-200 ${typeConfig.color}`} aria-hidden="true">
                      <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5"><circle cx="10" cy="10" r="3" /></svg>
                    </span>
                    <div className="rounded-xl border border-slate-200 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{typeConfig.label}</p>
                          <p className="mt-0.5 text-xs text-slate-500">{formatDate(event.created_at)}</p>
                        </div>
                        {(audience === "regulator" || audience === "repairer" || audience === "consumer") && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-200" title="Demo: in production, events are digitally signed.">
                            <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true"><path fillRule="evenodd" d="M16.704 5.29a1 1 0 010 1.415l-7.2 7.2a1 1 0 01-1.415 0l-3-3a1 1 0 111.415-1.414l2.293 2.293 6.492-6.494a1 1 0 011.415 0z" clipRule="evenodd"/></svg>
                            Verified
                          </span>
                        )}
                      </div>
                      <dl className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                        <div className="flex items-start gap-2">
                          <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 text-slate-400" aria-hidden="true"><path d="M10 10a4 4 0 100-8 4 4 0 000 8zm-7 7a7 7 0 1114 0H3z"/></svg>
                          <div>
                            <dt className="text-slate-500">Actor</dt>
                            <dd className="font-medium text-slate-900">{event.actor}</dd>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 text-slate-400" aria-hidden="true"><path fillRule="evenodd" d="M10 18s6-4.686 6-10A6 6 0 104 8c0 5.314 6 10 6 10zm0-7a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/></svg>
                          <div>
                            <dt className="text-slate-500">Location</dt>
                            <dd className="font-medium text-slate-900">{event.location || "—"}</dd>
                          </div>
                        </div>
                        {(audience !== "consumer" || showFullEventDetails) && (
                          <div className="sm:col-span-2">
                            <dt className="text-slate-500">Notes</dt>
                            <dd className="mt-0.5 whitespace-pre-wrap text-slate-800">{event.notes || "—"}</dd>
                          </div>
                        )}
                      </dl>
                      {showFullEventDetails && event.attributes && Object.keys(event.attributes as object).length > 0 && (
                        <div className="mt-2 rounded-lg bg-slate-50 p-2 text-xs text-slate-600">
                          <span className="font-medium text-slate-700">Event data:</span> {JSON.stringify(event.attributes)}
                        </div>
                      )}
                      {audience === "regulator" && (
                        <p className="mt-2 text-[11px] text-slate-500">Demo: in production, events are digitally signed and verifiable.</p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </section>
      )}
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function getAttributeDisplay(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value);
  try { return JSON.stringify(value); } catch { return "—"; }
}

function getStatus(eventType: string | null): { label: string; className: string } {
  switch ((eventType || "").toLowerCase()) {
    case "recycled": return { label: "Recycled", className: "bg-violet-100 text-violet-700" };
    case "repaired": return { label: "Repaired", className: "bg-orange-100 text-orange-700" };
    case "refurbished": return { label: "Refurbished", className: "bg-amber-100 text-amber-800" };
    case "sold": return { label: "In use", className: "bg-blue-100 text-blue-700" };
    case "shipped": return { label: "Shipped", className: "bg-sky-100 text-sky-700" };
    case "manufactured": return { label: "Manufactured", className: "bg-emerald-100 text-emerald-700" };
    default: return { label: eventType ? eventType.replace(/[-_]/g, " ") : "Registered", className: "bg-slate-100 text-slate-700" };
  }
}

function IndustryIcon({ industry, className = "h-6 w-6" }: { industry: IndustryId; className?: string }) {
  if (industry === "electronics") {
    return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true"><rect x="7" y="2.5" width="10" height="19" rx="2" /><path d="M10 18h4" strokeLinecap="round" /></svg>);
  }
  if (industry === "batteries") {
    return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true"><rect x="3" y="7" width="17" height="10" rx="2" /><path d="M20 10v4" strokeLinecap="round" /><path d="M7 12h4M9 10v4" strokeLinecap="round" /></svg>);
  }
  return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true"><path d="M12 4l8 3v4c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-3z" /><path d="M8.5 10.5h7" strokeLinecap="round" /></svg>);
}
