const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

export type OptionType = "call" | "put";

export interface OptionInput {
  underlying_price: number;
  strike: number;
  time_to_maturity: number;
  risk_free_rate: number;
  volatility: number;
  option_type: OptionType;
}

export interface OptionGreeks {
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  rho: number;
}

export interface OptionPriceResponse {
  price: number;
  greeks: OptionGreeks;
}

export async function priceOption(
  payload: OptionInput
): Promise<OptionPriceResponse> {
  const res = await fetch(`${API_BASE_URL}/api/v1/options/price`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Pricing request failed (${res.status}): ${text || res.statusText}`
    );
  }

  return res.json();
}