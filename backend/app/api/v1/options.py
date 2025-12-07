from fastapi import APIRouter

from app.schemas.options import OptionInput, OptionPriceResponse
from app.services.options_pricing import price_option

router = APIRouter(prefix="/options", tags=["options"])


@router.post("/price", response_model=OptionPriceResponse)
def price_option_endpoint(payload: OptionInput):
    return price_option(payload)
