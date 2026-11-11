import Image from "next/image";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { industryConfig, getEventTypeConfig } from "@/lib/industry";
import type { Product, ProductEvent } from "@/lib/types";

export const dynamic = "force-dynamic";

type PageProps = {
  params: { id: string };
};

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getAttributeDisplay(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  try {
    return JSON.stringify(value);
  } catch {
    return "—";
  }
}

export default async function PassportPage({ params }: PageProps) {
  const { id } = params;
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
  const passportUrl = `${baseUrl}/passport/${id}`;

  let product: Product | null = null;
  let events: ProductEvent[] = [];
  let qrDataUrl: string | null = null;
  let errorMessage: string | null = null;

  try {
    const supabase = getSupabaseAdmin();
    const { data: productData, error: productError } = await supabase
      .from("products")
      .select("id, name, model, manufacturer, attributes, created_at")
      .eq("id", id)
      .maybeSingle();

    if (productError) {
      throw new Error(productError.message);
    }

    if (!productData) {
      notFound();
    }

    product = productData as Product;

    const { data: eventData, error: eventsError } = await supabase
      .from("events")
      .select("id, product_id, event_type, actor, location, notes, attributes, created_at")
      .eq("product_id", id)
      .order("created_at", { ascending: false });

    if (eventsError) {
      throw new Error(eventsError.message);
    }

    events = (eventData ?? []) as ProductEvent[];
    qrDataUrl = await QRCode.toDataURL(passportUrl, {
      margin: 1,
      width: 240,
      color: { dark: "#0f172a", light: "#ffffff" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    // If notFound() was thrown, Next.js handles it via special error; rethrow non-DB render issues carefully.
    if (message === "NEXT_NOT_FOUND") {
      throw err;
    }
    // Invalid UUIDs or other lookup failures should feel like "not found" for public users.
    if (/invalid input syntax for type uuid/i.test(message)) {
      notFound();
    }
    errorMessage = `Unable to load this passport right now. ${message}`;
  }

  if (errorMessage || !product) {
    return (
      <main className="mx-auto min-h-screen max-w-xl p-4 sm:p-6">
        <div className="rounded-2xl border border-red-200 bg-white p-5 shadow-sm">
          <h1 className="text-lg font-semibold text-red-700">Passport unavailable</h1>
          <p className="mt-2 text-sm text-slate-700">{errorMessage ?? "The passport could not be loaded."}</p>
          <p className="mt-3 text-xs text-slate-500">Check your Supabase configuration and try again.</p>
        </div>
      </main>
    );
  }

  const attributes = (product.attributes ?? {}) as Record<string, unknown>;

  return (
    <main className="mx-auto min-h-screen max-w-2xl bg-slate-50 p-4 sm:p-6">
      <div className="space-y-4 sm:space-y-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-teal-700">Digital Product Passport</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">{product.name}</h1>
          <p className="mt-1 text-sm text-slate-600">
            {product.model} · {product.manufacturer}
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Unique ID</p>
                <p className="mt-1 break-all rounded-lg bg-slate-100 px-3 py-2 font-mono text-xs text-slate-800">
                  {product.id}
                </p>
              </div>
              <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-slate-500">Manufacturer</dt>
                  <dd className="font-medium text-slate-900">{product.manufacturer}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Model</dt>
                  <dd className="font-medium text-slate-900">{product.model}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-slate-500">Registered</dt>
                  <dd className="font-medium text-slate-900">{formatDateTime(product.created_at)}</dd>
                </div>
              </dl>
            </div>
            <div className="flex flex-col items-center rounded-xl border border-slate-200 bg-slate-50 p-3">
              {qrDataUrl ? (
                <Image
                  src={qrDataUrl}
                  alt={`QR code for passport ${product.id}`}
                  width={180}
                  height={180}
                  className="h-[180px] w-[180px] rounded-md bg-white p-1"
                  unoptimized
                />
              ) : (
                <div className="flex h-[180px] w-[180px] items-center justify-center rounded-md bg-white text-xs text-slate-500">
                  QR unavailable
                </div>
              )}
              <p className="mt-2 max-w-[180px] break-all text-center text-[10px] text-slate-500">{passportUrl}</p>
            </div>
          </div>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">Product details</h2>
          <p className="mt-1 text-xs text-slate-500">Industry profile: {industryConfig.name}</p>
          <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {industryConfig.productFields.map((field) => (
              <div key={field.key} className="rounded-lg bg-slate-50 p-3">
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{field.label}</dt>
                <dd className="mt-1 text-sm font-medium text-slate-900">{getAttributeDisplay(attributes[field.key])}</dd>
              </div>
            ))}
          </dl>
          {industryConfig.productFields.length === 0 && (
            <p className="mt-3 text-sm text-slate-600">No configured product fields.</p>
          )}
        </section>

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
              <a
                href={`/passport/${product.id}/add-event`}
                className="inline-flex items-center justify-center rounded-lg border border-teal-200 bg-white px-3 py-1.5 text-xs font-medium text-teal-700 hover:bg-teal-50"
              >
                Add event
              </a>
            </div>
          </div>

          {events.length === 0 ? (
            <p className="mt-4 rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-600">
              No events recorded for this product yet.
            </p>
          ) : (
            <ol className="mt-5 space-y-4">
              {events.map((event, index) => {
                const typeConfig = getEventTypeConfig(event.event_type);
                const isLast = index === events.length - 1;
                return (
                  <li key={event.id} className="relative pl-8">
                    {!isLast && <span className="absolute left-[9px] top-5 h-[calc(100%+0.25rem)] w-px bg-slate-200" aria-hidden="true" />}
                    <span
                      className={`absolute left-0 top-1.5 h-[18px] w-[18px] rounded-full border-2 border-white ring-1 ring-slate-200 ${typeConfig.color}`}
                      aria-hidden="true"
                    />
                    <div className="rounded-xl border border-slate-200 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{typeConfig.label}</p>
                          <p className="mt-0.5 text-xs text-slate-500">{formatDateTime(event.created_at)}</p>
                        </div>
                        <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">
                          {event.event_type}
                        </span>
                      </div>
                      <dl className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                        <div>
                          <dt className="text-slate-500">Actor</dt>
                          <dd className="font-medium text-slate-900">{event.actor}</dd>
                        </div>
                        <div>
                          <dt className="text-slate-500">Location</dt>
                          <dd className="font-medium text-slate-900">{event.location || "—"}</dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-slate-500">Notes</dt>
                          <dd className="whitespace-pre-wrap text-slate-800">{event.notes || "—"}</dd>
                        </div>
                      </dl>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </section>
      </div>
    </main>
  );
}
