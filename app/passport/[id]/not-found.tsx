import Link from "next/link";

export default function PassportNotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl items-center p-6">
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Passport not found</h1>
        <p className="mt-2 text-sm text-slate-600">
          We couldn&apos;t find a product passport for this ID. Please check the QR code or link and try again.
        </p>
        <Link
          href="/"
          className="mt-4 inline-flex rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
