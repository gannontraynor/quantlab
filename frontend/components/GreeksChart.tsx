"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { OptionGreeks } from "@/lib/api-client";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface GreeksChartProps {
  greeks: OptionGreeks;
}

export function GreeksChart({ greeks }: GreeksChartProps) {
  const labels = ["Delta", "Gamma", "Theta", "Vega", "Rho"];
  const values = [
    greeks.delta,
    greeks.gamma,
    greeks.theta,
    greeks.vega,
    greeks.rho,
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Greeks",
        data: values,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        grid: { color: "rgba(148, 163, 184, 0.1)" },
      },
    },
  };

  return (
    <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
      <p className="mb-2 text-xs text-slate-400">
        Greeks magnitude (model scale)
      </p>
      <Bar data={data} options={options as any} />
    </div>
  );
}