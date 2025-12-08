"use client";

import { useState } from "react";
import {
  fetchPortfolioSummary,
  Position,
  PortfolioSummary,
} from "@/lib/api-client";

const EMPTY_POSITION: Position = {
  symbol: "",
  quantity: 0,
  avg_price: 0,
  current_price: 0,
};

export default function PortfolioPage() {
  const [name, setName] = useState("My Portfolio");
  const [positions, setPositions] = useState<Position[]>([]);
  const [draft, setDraft] = useState<Position>({ ...EMPTY_POSITION });
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addPosition() {
    if (!draft.symbol || draft.quantity <= 0) return;
    setPositions((prev) => [...prev, { ...draft }]);
    setDraft({ ...EMPTY_POSITION });
    setSummary(null);
  }

  function removePosition(index: number) {
    setPositions((prev) => prev.filter((_, i) => i !== index));
    setSummary(null);
  }

  async function handleCalculate() {
    if (!positions.length) return;
    setLoading(true);
    setError(null);
    setSummary(null);

    try {
      const result = await fetchPortfolioSummary({ name, positions });
      setSummary(result);
    } catch (err: any) {
      setError(err.message || "Failed to calculate portfolio summary");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <header className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Portfolio Summary
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Build a simple equity portfolio, then compute total value and
              unrealized P&amp;L.
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-slate-400">Portfolio Name</label>
            <input
              className="rounded-md border border-slate-700 bg-slate-900 px-3 py-1 text-sm text-slate-100 outline-none focus:border-emerald-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </header>

        {/* Positions table */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg mb-6">
          <h2 className="text-lg font-medium mb-3">Positions</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm">
              <thead className="border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="py-2 text-left">Symbol</th>
                  <th className="py-2 text-right">Quantity</th>
                  <th className="py-2 text-right">Avg Price</th>
                  <th className="py-2 text-right">Current Price</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {positions.map((p, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-slate-800/60 last:border-b-0"
                  >
                    <td className="py-2">{p.symbol}</td>
                    <td className="py-2 text-right">{p.quantity}</td>
                    <td className="py-2 text-right">
                      ${p.avg_price.toFixed(2)}
                    </td>
                    <td className="py-2 text-right">
                      ${p.current_price.toFixed(2)}
                    </td>
                    <td className="py-2 text-right">
                      <button
                        onClick={() => removePosition(idx)}
                        className="text-xs text-red-400 hover:text-red-300"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}

                {/* Draft row */}
                <tr>
                  <td className="py-2">
                    <input
                      className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs outline-none focus:border-emerald-500"
                      placeholder="AAPL"
                      value={draft.symbol}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, symbol: e.target.value }))
                      }
                    />
                  </td>
                  <td className="py-2 text-right">
                    <input
                      type="number"
                      className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-right outline-none focus:border-emerald-500"
                      value={draft.quantity || ""}
                      onChange={(e) =>
                        setDraft((d) => ({
                          ...d,
                          quantity: Number(e.target.value || 0),
                        }))
                      }
                    />
                  </td>
                  <td className="py-2 text-right">
                    <input
                      type="number"
                      className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-right outline-none focus:border-emerald-500"
                      value={draft.avg_price || ""}
                      onChange={(e) =>
                        setDraft((d) => ({
                          ...d,
                          avg_price: Number(e.target.value || 0),
                        }))
                      }
                    />
                  </td>
                  <td className="py-2 text-right">
                    <input
                      type="number"
                      className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-right outline-none focus:border-emerald-500"
                      value={draft.current_price || ""}
                      onChange={(e) =>
                        setDraft((d) => ({
                          ...d,
                          current_price: Number(e.target.value || 0),
                        }))
                      }
                    />
                  </td>
                  <td className="py-2 text-right">
                    <button
                      type="button"
                      onClick={addPosition}
                      className="rounded-md bg-slate-800 px-3 py-1 text-xs text-slate-100 hover:bg-slate-700"
                    >
                      Add
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {positions.length === 0 && (
            <p className="mt-3 text-xs text-slate-500">
              Start by adding a position: symbol, quantity, average price, and
              current price.
            </p>
          )}

          <button
            type="button"
            disabled={!positions.length || loading}
            onClick={handleCalculate}
            className="mt-4 inline-flex items-center rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Calculating…" : "Calculate Summary"}
          </button>

          {error && (
            <p className="mt-2 text-xs text-red-400 border border-red-800/60 bg-red-950/40 rounded-md px-3 py-2">
              {error}
            </p>
          )}
        </div>

        {/* Summary cards */}
        {summary && (
          <div className="grid gap-4 md:grid-cols-4">
            <MetricCard
              label="Total Value"
              value={summary.total_value}
              prefix="$"
            />
            <MetricCard
              label="Total Cost"
              value={summary.total_cost}
              prefix="$"
            />
            <MetricCard
              label="Unrealized P&L"
              value={summary.unrealized_pnl}
              prefix="$"
              highlight
            />
            <MetricCard
              label="Unrealized P&L %"
              value={summary.unrealized_pnl_pct * 100}
              suffix="%"
              highlight
            />
          </div>
        )}
      </div>
    </div>
  );
}

interface MetricProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  highlight?: boolean;
}

function MetricCard({
  label,
  value,
  prefix,
  suffix,
  highlight,
}: MetricProps) {
  const display =
    value === undefined || value === null ? "—" : `${prefix ?? ""}${value.toFixed(2)}${suffix ?? ""}`;
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg">
      <p className="text-xs text-slate-400">{label}</p>
      <p
        className={`mt-1 text-xl font-semibold ${
          highlight ? "text-emerald-400" : "text-slate-100"
        }`}
      >
        {display}
      </p>
    </div>
  );
}