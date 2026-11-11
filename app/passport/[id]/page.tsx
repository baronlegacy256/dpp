import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { getIndustryConfig, getProductIndustryId } from "@/lib/industry";
import type { Product, ProductEvent } from "@/lib/types";
import PassportView from "./PassportView";

export const dynamic = "force-dynamic";

type PageProps = {
  params: { id: string };
};

async function fetchPassport(id: string) {
  const supabase = getSupabaseAdmin();
  const { data: productData, error: productError } = await supabase
    .from("products")
    .select("id, name, model, manufacturer, attributes, created_at")
    .eq("id", id)
    .maybeSingle();
  if (productError) throw new Error(productError.message);
  if (!productData) return null;
  const { data: eventData, error: eventsError } = await supabase
    .from("events")
    .select("id, product_id, event_type, actor, location, notes, attributes, created_at")
    .eq("product_id", id)
    .order("created_at", { ascending: false });
  if (eventsError) throw new Error(eventsError.message);
  return { product: productData as Product, events: (eventData ?? []) as ProductEvent[] };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const data = await fetchPassport(params.id);
    if (!data) return { title: "Passport not found" };
    const { product } = data;
    return {
      title: `${product.name} Passport`,
      description: `Digital Product Passport for ${product.name} by ${product.manufacturer} (${product.model}). View lifecycle, materials, sustainability and compliance data on TracePass.`,
    };
  } catch {
    return { title: "Product Passport" };
  }
}

export default async function PassportPage({ params }: PageProps) {
  const { id } = params;
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
  const passportUrl = `${baseUrl}/passport/${id}`;

  try {
    const data = await fetchPassport(id);
    if (!data) notFound();
    const { product, events } = data;
    const qrDataUrl = await QRCode.toDataURL(passportUrl, { margin: 1, width: 240, color: { dark: "#0f172a", light: "#ffffff" } });
    const attributes = (product.attributes ?? {}) as Record<string, unknown>;
    const industryId = getProductIndustryId(attributes);
    const industry = getIndustryConfig(industryId);

    return (
      <main className="mx-auto min-h-screen max-w-3xl bg-slate-50 p-4 sm:p-6">
        <div className="mb-3">
          <Link href="/" className="text-sm font-medium text-teal-700 hover:text-teal-800">← Back to TracePass</Link>
        </div>
        <PassportView
          product={{ id: product.id, name: product.name, model: product.model, manufacturer: product.manufacturer, created_at: product.created_at }}
          attributes={attributes}
          industryId={industryId}
          industry={industry}
          events={events}
          qrDataUrl={qrDataUrl}
        />
      </main>
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message === "NEXT_NOT_FOUND") throw err;
    if (/invalid input syntax for type uuid/i.test(message)) notFound();
    return (
      <main className="mx-auto min-h-screen max-w-xl p-4 sm:p-6">
        <div className="rounded-2xl border border-red-200 bg-white p-5 shadow-sm">
          <h1 className="text-lg font-semibold text-red-700">Passport unavailable</h1>
          <p className="mt-2 text-sm text-slate-700">Unable to load this passport right now. {message}</p>
          <p className="mt-3 text-xs text-slate-500">Check your Supabase configuration and try again.</p>
          <Link href="/" className="mt-4 inline-flex text-sm font-medium text-teal-700 hover:text-teal-800">Back to home</Link>
        </div>
      </main>
    );
  }
}
