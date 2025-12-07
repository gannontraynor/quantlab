from math import log, sqrt, exp
from scipy.stats import norm


def price_option(payload):
    S = payload.underlying_price
    K = payload.strike
    r = payload.risk_free_rate
    sigma = payload.volatility
    T = payload.time_to_maturity

    if T <= 0:
        raise ValueError("Time to maturity must be positive")

    d1 = (log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * sqrt(T))
    d2 = d1 - sigma * sqrt(T)

    # Price
    if payload.option_type == "call":
        price = S * norm.cdf(d1) - K * exp(-r * T) * norm.cdf(d2)
    else:
        price = K * exp(-r * T) * norm.cdf(-d2) - S * norm.cdf(-d1)

    # Greeks
    delta = norm.cdf(d1) if payload.option_type == "call" else norm.cdf(d1) - 1
    gamma = norm.pdf(d1) / (S * sigma * sqrt(T))
    vega = S * norm.pdf(d1) * sqrt(T)
    theta_call = -(S * norm.pdf(d1) * sigma) / (2 * sqrt(T)) - r * K * exp(
        -r * T
    ) * norm.cdf(d2)
    theta_put = -(S * norm.pdf(d1) * sigma) / (2 * sqrt(T)) + r * K * exp(
        -r * T
    ) * norm.cdf(-d2)
    theta = theta_call if payload.option_type == "call" else theta_put
    rho_call = K * T * exp(-r * T) * norm.cdf(d2)
    rho_put = -K * T * exp(-r * T) * norm.cdf(-d2)
    rho = rho_call if payload.option_type == "call" else rho_put

    return {
        "price": float(price),
        "greeks": {
            "delta": float(delta),
            "gamma": float(gamma),
            "theta": float(theta),
            "vega": float(vega),
            "rho": float(rho),
        },
    }
