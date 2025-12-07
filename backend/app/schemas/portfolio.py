from typing import List
from pydantic import BaseModel


class Position(BaseModel):
    symbol: str
    quantity: float
    avg_price: float
    current_price: float


class PortfolioSnapshot(BaseModel):
    id: str | None = None
    name: str = "Default"
    positions: List[Position]


class PortfolioSummary(BaseModel):
    total_value: float
    total_cost: float
    unrealized_pnl: float
    pnl_pct: float
