"use client";

import { FormEvent, useMemo, useState } from "react";
import QRCode from "qrcode";
import { industryConfig } from "@/lib/industry";

type CreatedProduct = {
  id: string;
  name: string;
  model: string;
  manufacturer: string;
  attributes: Record<string, unknown> | null;
  created_at: string;
};

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [model, setModel] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [passcode, setPasscode] = useState("");
  const [dynamicValues, setDynamicValues] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<CreatedProduct | null>(null);
  const [passportUrl, setPassportUrl] = useState<string>("");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  const canSubmit = useMemo(() => {
    return !submitting && name.trim() && model.trim() && manufacturer.trim() && passcode.trim();
  }, [submitting, name, model, manufacturer, passcode]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!canSubmit) {
      setError("Please fill in name, model, manufacturer, and passcode.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          model,
          manufacturer,
          passcode,
          attributes: dynamicValues,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error((data as { error?: string }).error || "Failed to create product.");
      }

      const product = (data as { product: CreatedProduct }).product;
      const urlFromApi = (data as { passportUrl?: string }).passportUrl || `/passport/${product.id}`;
      const absoluteUrl = urlFromApi.startsWith("http")
        ? urlFromApi
        : `${window.location.origin}${urlFromApi}`;
      const qr = await QRCode.toDataURL(absoluteUrl, {
        margin: 1,
        width: 320,
        color: { dark: "#0f172a", light: "#ffffff" },
      });

      setCreated(product);
      setPassportUrl(absoluteUrl);
      setQrDataUrl(qr);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product.");
    } finally {
      setSubmitting(false);
    }
  }

  function downloadQr() {
    if (!qrDataUrl || !created) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `passport-${created.id}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  if (created) {
    return (
      <main className="mx-auto min-h-screen max-w-xl p-4 sm:p-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-teal-700">Registration complete</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">{created.name}</h1>
          <p className="mt-1 text-sm text-slate-600">{created.model} · {created.manufacturer}</p>

          <div className="mt-5 space-y-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Unique ID</p>
              <p className="mt-1 break-all rounded-lg bg-slate-100 px-3 py-2 font-mono text-xs text-slate-800">{created.id}</p>
            </div>

            <div className="flex flex-col items-center rounded-xl border border-slate-200 bg-slate-50 p-4">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt={`QR code for ${created.name}`} className="h-56 w-56 rounded-md bg-white p-1" />
              ) : (
                <p className="text-sm text-slate-600">QR code unavailable.</p>
              )}
              <p className="mt-2 break-all text-center text-xs text-slate-500">{passportUrl}</p>
              <div className="mt-3 flex w-full flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={downloadQr}
                  className="inline-flex items-center justify-center rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
                >
                  Download QR code
                </button>
                <a
                  href={passportUrl}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Open passport
                </a>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setCreated(null);
                setQrDataUrl("");
                setPassportUrl("");
                setName("");
                setModel("");
                setManufacturer("");
                setPasscode("");
                setDynamicValues({});
              }}
              className="text-sm font-medium text-teal-700 hover:text-teal-800"
            >
              Register another product
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-xl p-4 sm:p-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-teal-700">New product</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">Register product</h1>
        <p className="mt-1 text-sm text-slate-600">Create a product passport and generate its QR code. Industry: {industryConfig.name}.</p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Name *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-teal-500 focus:border-teal-500 focus:ring-1"
              placeholder="e.g. EcoPhone X"
              required
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700">Model *</label>
              <input
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-teal-500 focus:border-teal-500 focus:ring-1"
                placeholder="e.g. EPX-2026"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Manufacturer *</label>
              <input
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-teal-500 focus:border-teal-500 focus:ring-1"
                placeholder="e.g. Northwind Electronics"
                required
              />
            </div>
          </div>

          {industryConfig.productFields.length > 0 && (
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-sm font-medium text-slate-800">Additional details ({industryConfig.name})</p>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {industryConfig.productFields.map((field) => (
                  <div key={field.key} className={field.type === "text" ? "sm:col-span-2" : ""}>
                    <label className="block text-sm font-medium text-slate-700">{field.label}</label>
                    <input
                      type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                      value={dynamicValues[field.key] ?? ""}
                      onChange={(e) => setDynamicValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-teal-500 focus:border-teal-500 focus:ring-1"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

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

          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex w-full items-center justify-center rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Creating product..." : "Create product & generate QR"}
          </button>
        </form>
      </div>
    </main>
  );
}
