import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default async function Home() {
  let products: Product[] = [];
  let errorMessage: string | null = null;

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("products")
      .select("id, name, model, manufacturer, attributes, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }
    products = (data ?? []) as Product[];
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : "Failed to load products.";
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl p-4 sm:p-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-teal-700">DPP demonstrator</p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900 sm:text-3xl">Digital Product Passports</h1>
            <p className="mt-2 max-w-xl text-sm text-slate-600">
              Browse registered products, open their public passport pages, or register a new product to generate a QR code.
            </p>
          </div>
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-700"
          >
            Register product
          </Link>
        </div>
      </header>

      <section className="mt-4 sm:mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Products</h2>
          {!errorMessage && (
            <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700">
              {products.length} total
            </span>
          )}
        </div>

        {errorMessage ? (
          <div className="rounded-2xl border border-red-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-red-700">Unable to load products</h3>
            <p className="mt-2 text-sm text-slate-700">{errorMessage}</p>
            <p className="mt-2 text-xs text-slate-500">Check `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and database connectivity.</p>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center shadow-sm">
            <p className="text-sm font-medium text-slate-900">No products registered yet</p>
            <p className="mt-1 text-sm text-slate-600">Create the first Digital Product Passport to get started.</p>
            <Link
              href="/register"
              className="mt-4 inline-flex items-center justify-center rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
            >
              Register a product
            </Link>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:gap-4">
            {products.map((product) => (
              <li key={product.id}>
                <Link
                  href={`/passport/${product.id}`}
                  className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-teal-300 hover:shadow-md sm:p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-lg font-semibold text-slate-900">{product.name}</p>
                      <p className="mt-0.5 text-sm text-slate-600">
                        {product.model} · {product.manufacturer}
                      </p>
                      <p className="mt-2 truncate font-mono text-xs text-slate-500">{product.id}</p>
                    </div>
                    <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end sm:justify-start">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        {formatDate(product.created_at)}
                      </span>
                      <span className="text-sm font-medium text-teal-700">View passport →</span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
