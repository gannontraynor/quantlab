"use client";

import { useState } from "react";
import {
  priceOption,
  OptionInput,
  OptionPriceResponse,
  OptionType,
} from "@/lib/api-client";

const defaultForm: OptionInput = {
  underlying_price: 100,
  strike: 100,
  time_to_maturity: 0.5,
  risk_free_rate: 0.01,
  volatility: 0.2,
  option_type: "call",
};

export default function OptionsPage() {
  const [form, setForm] = useState<OptionInput>(defaultForm);
  const [result, setResult] = useState<OptionPriceResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField<K extends keyof OptionInput>(
    key: K,
    value: string | number
  ) {
    if (
      key === "underlying_price" ||
      key === "strike" ||
      key === "time_to_maturity" ||
      key === "risk_free_rate" ||
      key === "volatility"
    ) {
      const num = Number(value);
      setForm((prev) => ({ ...prev, [key]: isNaN(num) ? 0 : num }));
    } else if (key === "option_type") {
      setForm((prev) => ({ ...prev, option_type: value as OptionType }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await priceOption(form);
      setResult(res);
    } catch (err: any) {
      setError(err.message || "Failed to price option");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">
            Options Pricing Lab
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Black–Scholes pricing with Greeks. Enter contract parameters, hit
            price, and inspect sensitivities.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-[2fr,1.5fr] items-start">
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg"
          >
            <h2 className="text-lg font-medium mb-2">Contract Inputs</h2>

            <div className="grid grid-cols-2 gap-4">
              <Field
                label="Underlying Price (S)"
                value={form.underlying_price}
                onChange={(v) => updateField("underlying_price", v)}
              />
              <Field
                label="Strike (K)"
                value={form.strike}
                onChange={(v) => updateField("strike", v)}
              />
              <Field
                label="Time to Maturity (years)"
                value={form.time_to_maturity}
                step="0.1"
                onChange={(v) => updateField("time_to_maturity", v)}
              />
              <Field
                label="Risk-free Rate (r)"
                value={form.risk_free_rate}
                step="0.005"
                helper="As decimal: 0.01 = 1%"
                onChange={(v) => updateField("risk_free_rate", v)}
              />
              <Field
                label="Volatility (σ)"
                value={form.volatility}
                step="0.01"
                helper="As decimal: 0.2 = 20%"
                onChange={(v) => updateField("volatility", v)}
              />
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-300">
                  Option Type
                </label>
                <div className="inline-flex rounded-lg border border-slate-700 bg-slate-900/80 p-1 text-xs">
                  <button
                    type="button"
                    onClick={() => updateField("option_type", "call")}
                    className={`flex-1 rounded-md px-3 py-1 ${
                      form.option_type === "call"
                        ? "bg-emerald-500 text-slate-950 font-semibold"
                        : "text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    Call
                  </button>
                  <button
                    type="button"
                    onClick={() => updateField("option_type", "put")}
                    className={`flex-1 rounded-md px-3 py-1 ${
                      form.option_type === "put"
                        ? "bg-emerald-500 text-slate-950 font-semibold"
                        : "text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    Put
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-md hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Pricing…" : "Price Option"}
            </button>

            {error && (
              <p className="mt-2 text-xs text-red-400 border border-red-700/60 bg-red-950/40 rounded-md px-3 py-2">
                {error}
              </p>
            )}
          </form>

          {/* Results */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg">
              <h2 className="text-lg font-medium mb-2">Price</h2>
              {result ? (
                <div className="space-y-1">
                  <p className="text-3xl font-semibold text-emerald-400">
                    ${result.price.toFixed(4)}
                  </p>
                  <p className="text-xs text-slate-400">
                    Black–Scholes fair value ({form.option_type.toUpperCase()})
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  Run a calculation to see the model price.
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg">
              <h2 className="text-lg font-medium mb-2">Greeks</h2>
              {result ? (
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <Greek label="Delta" value={result.greeks.delta} />
                  <Greek label="Gamma" value={result.greeks.gamma} />
                  <Greek label="Vega" value={result.greeks.vega} />
                  <Greek label="Theta" value={result.greeks.theta} />
                  <Greek label="Rho" value={result.greeks.rho} />
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  Greeks will populate once you run a pricing request.
                </p>
              )}
              <p className="mt-3 text-[11px] text-slate-500">
                Note: Theta is per year in model units. You can extend this
                later to show per-day decay.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  value: number;
  step?: string;
  helper?: string;
  onChange: (value: string) => void;
}

function Field({ label, value, step, helper, onChange }: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-slate-300">{label}</label>
      <input
        type="number"
        value={value}
        step={step ?? "0.01"}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-100 outline-none focus:border-emerald-500"
      />
      {helper && <p className="text-[10px] text-slate-500">{helper}</p>}
    </div>
  );
}

interface GreekProps {
  label: string;
  value: number;
}

function Greek({ label, value }: GreekProps) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2">
      <p className="text-[11px] text-slate-400">{label}</p>
      <p className="text-sm font-semibold text-slate-100">
        {value.toFixed(4)}
      </p>
    </div>
  );
}