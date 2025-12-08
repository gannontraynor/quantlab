"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <header className="mb-10 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">QuantLab</h1>
            <p className="mt-2 text-sm text-slate-400">
              A personal quant sandbox: portfolio analytics, options pricing,
              and risk-oriented tools built with FastAPI &amp; Next.js.
            </p>
          </div>
        </header>

        <main className="grid gap-6 md:grid-cols-3">
          <SectionCard
            title="Portfolio Summary"
            href="/portfolio"
            description="Aggregate P&L, total value, and exposure from a simple equity book."
          />
          <SectionCard
            title="Options Pricing"
            href="/options"
            description="Black–Scholes pricing with full Greeks. Great for scenario testing."
          />
          <SectionCard
            title="Future Modules"
            href="#"
            description="Room for factor models, risk decomposition, and trade journaling."
            disabled
          />
        </main>
      </div>
    </div>
  );
}

interface SectionCardProps {
  title: string;
  description: string;
  href: string;
  disabled?: boolean;
}

function SectionCard({ title, description, href, disabled }: SectionCardProps) {
  const content = (
    <div
      className={`h-full rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-md ${
        disabled ? "opacity-60 cursor-not-allowed" : "hover:border-emerald-500"
      }`}
    >
      <h2 className="text-lg font-medium mb-1">{title}</h2>
      <p className="text-xs text-slate-400">{description}</p>
    </div>
  );

  if (disabled) return content;
  return <Link href={href}>{content}</Link>;
}
