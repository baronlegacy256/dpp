export default function Loading() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl p-4 sm:p-6" aria-busy="true" aria-live="polite">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
        <div className="mt-4 h-8 w-2/3 animate-pulse rounded bg-slate-200" />
        <div className="mt-3 h-4 w-full animate-pulse rounded bg-slate-100" />
        <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-slate-100" />
        <p className="mt-6 text-sm text-slate-600">Loading TracePass…</p>
      </div>
    </main>
  );
}
