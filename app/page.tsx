import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { getIndustryConfig, getProductIndustryId, type IndustryId } from "@/lib/industry";
import type { Product, ProductEvent } from "@/lib/types";

export const dynamic = "force-dynamic";

type ProductWithMeta = Product & {
  eventCount: number;
  lastUpdated: string;
  latestEventType: string | null;
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function shortId(id: string) {
  return `DPP-${id.replace(/-/g, "").slice(0, 6).toUpperCase()}`;
}

function getStatus(eventType: string | null): { label: string; className: string } {
  switch ((eventType || "").toLowerCase()) {
    case "recycled":
      return { label: "Recycled", className: "bg-violet-100 text-violet-700" };
    case "repaired":
      return { label: "Repaired", className: "bg-orange-100 text-orange-700" };
    case "refurbished":
      return { label: "Refurbished", className: "bg-amber-100 text-amber-800" };
    case "sold":
      return { label: "In use", className: "bg-blue-100 text-blue-700" };
    case "shipped":
      return { label: "Shipped", className: "bg-sky-100 text-sky-700" };
    case "manufactured":
      return { label: "Manufactured", className: "bg-emerald-100 text-emerald-700" };
    default:
      return { label: eventType ? eventType.replace(/[-_]/g, " ") : "Registered", className: "bg-slate-100 text-slate-700" };
  }
}

function IndustryIcon({ industry, className = "h-5 w-5" }: { industry: IndustryId; className?: string }) {
  if (industry === "electronics") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
        <rect x="7" y="2.5" width="10" height="19" rx="2" />
        <path d="M10 18h4" strokeLinecap="round" />
      </svg>
    );
  }
  if (industry === "batteries") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
        <rect x="3" y="7" width="17" height="10" rx="2" />
        <path d="M20 10v4" strokeLinecap="round" />
        <path d="M7 12h4M9 10v4" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M12 4l8 3v4c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-3z" />
      <path d="M8.5 10.5h7" strokeLinecap="round" />
    </svg>
  );
}

export default async function Home() {
  let products: ProductWithMeta[] = [];
  let errorMessage: string | null = null;

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("products")
      .select("id, name, model, manufacturer, attributes, created_at, events(id, event_type, created_at)")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    products = ((data ?? []) as (Product & { events?: Pick<ProductEvent, "id" | "event_type" | "created_at">[] })[]).map((p) => {
      const events = [...(p.events ?? [])].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      const latest = events[0];
      return {
        id: p.id,
        name: p.name,
        model: p.model,
        manufacturer: p.manufacturer,
        attributes: p.attributes,
        created_at: p.created_at,
        eventCount: events.length,
        lastUpdated: latest?.created_at ?? p.created_at,
        latestEventType: latest?.event_type ?? null,
      };
    });
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : "Failed to load products.";
  }

  const sampleId = products[0]?.id;

  return (
    <main className="mx-auto min-h-screen max-w-5xl p-4 sm:p-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">TracePass · Digital Product Passport demonstrator</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Every product&apos;s story, one scan away.</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
              EU Digital Product Passport rules are coming for batteries, textiles, electronics and more. TracePass shows how a single QR can reveal origin, lifecycle events, materials, and sustainability data for consumers, repairers, and regulators.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              {sampleId ? (
                <Link href={`/passport/${sampleId}`} className="inline-flex items-center justify-center rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-700">
                  View a sample passport
                </Link>
              ) : (
                <span className="inline-flex items-center justify-center rounded-lg bg-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600">Sample passport unavailable</span>
              )}
              <Link href="/register" className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                Register a product
              </Link>
              <Link href="/about" className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                Roadmap
              </Link>
            </div>
          </div>
          <div className="rounded-xl border border-teal-100 bg-teal-50 p-4 text-sm text-teal-900 lg:max-w-xs">
            <p className="font-medium">Built for transparency</p>
            <p className="mt-1 text-teal-800">One passport per product, updated across its life, ready to share via QR.</p>
          </div>
        </div>
      </header>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-base font-semibold text-slate-900">How it works</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { title: "Register", desc: "Create a passport with product details and industry profile.", icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5"><path d="M12 5v14M5 12h14" strokeLinecap="round"/></svg>) },
            { title: "Scan", desc: "Share a QR code that opens the public passport instantly.", icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5"><path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4" strokeLinecap="round"/><path d="M8 12h8" strokeLinecap="round"/></svg>) },
            { title: "Track", desc: "Record lifecycle events, materials, and sustainability data.", icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5"><path d="M4 19h16" strokeLinecap="round"/><path d="M7 16V9m5 7V5m5 11v-6" strokeLinecap="round"/></svg>) },
          ].map((step, i) => (
            <div key={step.title} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-teal-600 text-white">{step.icon}</span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-teal-700">Step {i + 1}</p>
                  <p className="text-sm font-semibold text-slate-900">{step.title}</p>
                </div>
              </div>
              <p className="mt-2 text-sm text-slate-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Product passports</h2>
          {!errorMessage && <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700">{products.length} total</span>}
        </div>

        {errorMessage ? (
          <div className="rounded-2xl border border-red-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-red-700">Unable to load products</h3>
            <p className="mt-2 text-sm text-slate-700">{errorMessage}</p>
            <p className="mt-2 text-xs text-slate-500">Check `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and that schema/seed data are applied.</p>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center shadow-sm">
            <p className="text-sm font-medium text-slate-900">No products registered yet</p>
            <p className="mt-1 text-sm text-slate-600">Create the first Digital Product Passport to get started.</p>
            <Link href="/register" className="mt-4 inline-flex items-center justify-center rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700">Register a product</Link>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const industryId = getProductIndustryId(product.attributes);
              const industry = getIndustryConfig(industryId);
              const status = getStatus(product.latestEventType);
              return (
                <li key={product.id}>
                  <Link href={`/passport/${product.id}`} className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md">
                    <div className="flex items-start justify-between gap-2">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                        <IndustryIcon industry={industryId} />
                      </span>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}>{status.label}</span>
                    </div>
                    <div className="mt-3 min-w-0">
                      <p className="truncate text-base font-semibold text-slate-900">{product.name}</p>
                      <p className="mt-0.5 truncate text-sm text-slate-600">{product.manufacturer}</p>
                      <p className="mt-1 text-xs text-slate-500">{industry.name} · {shortId(product.id)}</p>
                    </div>
                    <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-lg bg-slate-50 p-2">
                        <dt className="text-slate-500">Events</dt>
                        <dd className="mt-0.5 font-semibold text-slate-900">{product.eventCount}</dd>
                      </div>
                      <div className="rounded-lg bg-slate-50 p-2">
                        <dt className="text-slate-500">Last updated</dt>
                        <dd className="mt-0.5 font-semibold text-slate-900">{formatDate(product.lastUpdated)}</dd>
                      </div>
                    </dl>
                    <p className="mt-4 text-sm font-medium text-teal-700">View passport →</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <footer className="mt-10 border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <p><span className="font-medium text-slate-700">TracePass</span> · Demonstrator, sample data · <Link href="/about" className="font-medium text-teal-700 hover:text-teal-800">Roadmap</Link></p>
      </footer>
    </main>
  );
}
