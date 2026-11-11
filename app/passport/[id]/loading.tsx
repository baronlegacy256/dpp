export default function LoadingPassport() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl bg-slate-50 p-4 sm:p-6" aria-busy="true" aria-live="polite">
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
          <div className="mt-3 h-8 w-3/4 animate-pulse rounded bg-slate-200" />
          <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-slate-100" />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="h-24 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-24 animate-pulse rounded-xl bg-slate-100" />
            <div className="h-24 animate-pulse rounded-xl bg-slate-100" />
          </div>
        </div>
        <p className="text-sm text-slate-600">Loading passport…</p>
      </div>
    </main>
  );
}
