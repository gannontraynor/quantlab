from fastapi import APIRouter

from app.schemas.portfolio import PortfolioSnapshot, PortfolioSummary
from app.services.portfolio_service import compute_portfolio_summary

router = APIRouter(prefix="/portfolio", tags=["portfolio"])


@router.post("/summary", response_model=PortfolioSummary)
def get_portfolio_summary(snapshot: PortfolioSnapshot):
    """Take a simple in-memory portfolio and return aggregate stats."""
    return compute_portfolio_summary(snapshot.positions)
