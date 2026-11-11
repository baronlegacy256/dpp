import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Roadmap",
  description: "TracePass roadmap: from demonstrator to standards-based, trusted Digital Product Passports.",
};

const phases = [
  {
    phase: "Phase 1",
    title: "Demo today",
    status: "Current",
    points: [
      "Interactive Digital Product Passports with QR access, lifecycle timelines, and sustainability snapshots.",
      "Multi-industry profiles (electronics, batteries, textiles) with sample data for investor and stakeholder demos.",
      "Audience views to preview consumer, repairer, and regulator needs in one experience.",
    ],
  },
  {
    phase: "Phase 2",
    title: "Standards alignment",
    status: "Next",
    points: [
      "Adopt GS1 Digital Link identifiers for interoperable product resolution across systems.",
      "Model lifecycle events using EPCIS-style event semantics for supply-chain traceability.",
      "Map data fields to emerging EU Digital Product Passport requirements by product category.",
    ],
  },
  {
    phase: "Phase 3",
    title: "Trust and integrations",
    status: "Planned",
    points: [
      "Digitally signed events and verifiable credentials to prove data integrity and provenance.",
      "Supplier data feeds and ERP/PLM integrations for automated, up-to-date passport records.",
      "Role-based access control, audit trails, and selective disclosure for sensitive information.",
    ],
  },
];

export default function AboutPage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl p-4 sm:p-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">TracePass</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Roadmap</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
          From a compelling demonstrator to a standards-based platform for trusted Digital Product Passports across industries.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/" className="inline-flex items-center justify-center rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-700">View demo</Link>
          <Link href="/register" className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Register a product</Link>
        </div>
      </header>

      <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {phases.map((p) => (
          <article key={p.phase} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">{p.phase}</p>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">{p.status}</span>
            </div>
            <h2 className="mt-2 text-lg font-semibold text-slate-900">{p.title}</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {p.points.map((point) => (
                <li key={point} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-600" aria-hidden="true" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <footer className="mt-10 border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <p><span className="font-medium text-slate-700">TracePass</span> · Demonstrator, sample data</p>
      </footer>
    </main>
  );
}
