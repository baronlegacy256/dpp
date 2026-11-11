"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import { defaultIndustryId, industries, industryList, type IndustryId } from "@/lib/industry";

type CreatedProduct = {
  id: string;
  name: string;
  model: string;
  manufacturer: string;
  attributes: Record<string, unknown> | null;
  created_at: string;
};

const sampleData: Record<IndustryId, { name: string; model: string; manufacturer: string; fields: Record<string, string> }> = {
  electronics: { name: "NovaTab 11", model: "NT11-2026", manufacturer: "BrightGrid Electronics", fields: { category: "Tablet", color: "Slate", serialNumber: "BG-NT11-00931" } },
  batteries: { name: "PowerCore Home 5", model: "PCH-5-LFP", manufacturer: "VoltEdge Energy", fields: { category: "Home battery module", chemistry: "LFP", capacityKwh: "5", serialNumber: "VE-PCH5-77120" } },
  textiles: { name: "Harbor Shell Jacket", model: "HSJ-RN-02", manufacturer: "Coastline Apparel", fields: { category: "Rain jacket", color: "Navy", size: "L", serialNumber: "CA-HSJ02-B2604" } },
};

export default function RegisterPage() {
  const passcodeHint = process.env.NEXT_PUBLIC_DEMO_PASSCODE_HINT || "";
  const [industryId, setIndustryId] = useState<IndustryId>(defaultIndustryId);
  const [name, setName] = useState("");
  const [model, setModel] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [passcode, setPasscode] = useState(passcodeHint);
  const [dynamicValues, setDynamicValues] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<CreatedProduct | null>(null);
  const [passportUrl, setPassportUrl] = useState<string>("");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  const industry = industries[industryId];

  const canSubmit = useMemo(() => {
    return !submitting && name.trim() && model.trim() && manufacturer.trim() && passcode.trim();
  }, [submitting, name, model, manufacturer, passcode]);

  function fillSample() {
    const s = sampleData[industryId];
    setName(s.name);
    setModel(s.model);
    setManufacturer(s.manufacturer);
    setDynamicValues(s.fields);
    if (passcodeHint) setPasscode(passcodeHint);
    setError(null);
  }

  function onIndustryChange(next: IndustryId) {
    setIndustryId(next);
    setDynamicValues({});
  }

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
        body: JSON.stringify({ name, model, manufacturer, industry: industryId, passcode, attributes: dynamicValues }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error((data as { error?: string }).error || "Failed to create product.");
      }

      const product = (data as { product: CreatedProduct }).product;
      const urlFromApi = (data as { passportUrl?: string }).passportUrl || `/passport/${product.id}`;
      const absoluteUrl = urlFromApi.startsWith("http") ? urlFromApi : `${window.location.origin}${urlFromApi}`;
      const qr = await QRCode.toDataURL(absoluteUrl, { margin: 1, width: 360, color: { dark: "#0f172a", light: "#ffffff" } });

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
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-sm font-semibold text-emerald-800">Passport created successfully</p>
            <p className="mt-1 text-sm text-emerald-700">Your Digital Product Passport is ready to share. Scan or download the QR code below.</p>
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-slate-900">{created.name}</h1>
          <p className="mt-1 text-sm text-slate-600">{created.model} · {created.manufacturer}</p>

          <div className="mt-5 flex flex-col items-center rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt={`QR code for ${created.name}`} className="h-64 w-64 rounded-xl bg-white p-2 shadow-sm sm:h-72 sm:w-72" />
            ) : (
              <p className="text-sm text-slate-600">QR code unavailable.</p>
            )}
            <div className="mt-4 flex w-full flex-col gap-2 sm:flex-row">
              <button type="button" onClick={downloadQr} className="inline-flex flex-1 items-center justify-center rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-700">
                Download QR
              </button>
              <a href={passportUrl} className="inline-flex flex-1 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                Open passport
              </a>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={() => {
                setCreated(null);
                setQrDataUrl("");
                setPassportUrl("");
                setName("");
                setModel("");
                setManufacturer("");
                setDynamicValues({});
                setPasscode(passcodeHint);
              }}
              className="font-medium text-teal-700 hover:text-teal-800"
            >
              Register another product
            </button>
            <Link href="/" className="text-slate-600 hover:text-slate-900">Back to home</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-xl p-4 sm:p-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-teal-700">TracePass</p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900">Register a product</h1>
            <p className="mt-1 text-sm text-slate-600">Create a Digital Product Passport and generate its QR code.</p>
          </div>
          <Link href="/" className="text-sm font-medium text-teal-700 hover:text-teal-800">Home</Link>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-slate-700">Industry profile *</label>
            <select
              id="industry"
              value={industryId}
              onChange={(e) => onIndustryChange(e.target.value as IndustryId)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-teal-500 focus:border-teal-500 focus:ring-1"
            >
              {industryList.map((ind) => (
                <option key={ind.id} value={ind.id}>{ind.name}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end">
            <button type="button" onClick={fillSample} className="text-sm font-medium text-teal-700 hover:text-teal-800">
              Fill with sample data
            </button>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">Name *</label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-teal-500 focus:border-teal-500 focus:ring-1" placeholder="e.g. Aurora One Smartphone" required />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="model" className="block text-sm font-medium text-slate-700">Model *</label>
              <input id="model" value={model} onChange={(e) => setModel(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-teal-500 focus:border-teal-500 focus:ring-1" placeholder="e.g. AUR-1-2025" required />
            </div>
            <div>
              <label htmlFor="manufacturer" className="block text-sm font-medium text-slate-700">Manufacturer *</label>
              <input id="manufacturer" value={manufacturer} onChange={(e) => setManufacturer(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-teal-500 focus:border-teal-500 focus:ring-1" placeholder="e.g. Nordic Devices AB" required />
            </div>
          </div>

          {industry.productFields.length > 0 && (
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-sm font-medium text-slate-800">Additional details ({industry.name})</p>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {industry.productFields.map((field) => (
                  <div key={field.key} className={field.type === "text" ? "sm:col-span-2" : ""}>
                    <label htmlFor={field.key} className="block text-sm font-medium text-slate-700">{field.label}</label>
                    <input
                      id={field.key}
                      type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
                      step={field.type === "number" ? "any" : undefined}
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
            <label htmlFor="passcode" className="block text-sm font-medium text-slate-700">Demo passcode *</label>
            <input
              id="passcode"
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-teal-500 focus:border-teal-500 focus:ring-1"
              placeholder="Enter demo passcode"
              autoComplete="off"
              required
            />
            <p className="mt-1 text-xs text-slate-500">Required for write actions. Passports remain publicly readable.</p>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{error}</div>
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
