from typing import List
from app.schemas.portfolio import Position, PortfolioSummary


def compute_portfolio_summary(positions: List[Position]) -> PortfolioSummary:
    total_cost = sum(p.quantity * p.avg_price for p in positions)
    total_value = sum(p.quantity * p.current_price for p in positions)
    unrealized_pnl = total_value - total_cost
    pnl_pct = (unrealized_pnl / total_cost) * 100 if total_cost else 0.0

    return PortfolioSummary(
        total_value=total_value,
        total_cost=total_cost,
        unrealized_pnl=unrealized_pnl,
        pnl_pct=pnl_pct,
    )
