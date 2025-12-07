from pydantic import BaseModel


class OptionInput(BaseModel):
    underlying_price: float
    strike: float
    time_to_maturity: float  # in years
    risk_free_rate: float  # as decimal, e.g. 0.05
    volatility: float  # as decimal, e.g. 0.2
    option_type: str  # "call" or "put"


class OptionGreeks(BaseModel):
    delta: float
    gamma: float
    theta: float
    vega: float
    rho: float


class OptionPriceResponse(BaseModel):
    price: float
    greeks: OptionGreeks
