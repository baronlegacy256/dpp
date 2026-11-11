"use client";

export default function QrCard({
  qrDataUrl,
  productName,
  productId,
}: {
  qrDataUrl: string | null;
  productName: string;
  productId: string;
}) {
  function downloadQr() {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `passport-${productId}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Share this passport</h2>
          <p className="mt-1 text-sm text-slate-600">Scan the QR code to open the public Digital Product Passport for {productName}.</p>
        </div>
        <button
          type="button"
          onClick={downloadQr}
          disabled={!qrDataUrl}
          className="inline-flex items-center justify-center rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Download QR
        </button>
      </div>
      <div className="mt-4 flex justify-center sm:justify-start">
        {qrDataUrl ? (
          <img src={qrDataUrl} alt={`QR code for ${productName} passport`} className="h-40 w-40 rounded-xl border border-slate-200 bg-white p-2" />
        ) : (
          <div className="flex h-40 w-40 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-500">QR unavailable</div>
        )}
      </div>
    </section>
  );
}
