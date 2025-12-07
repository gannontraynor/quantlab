from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import health, portfolio, options

app = FastAPI(
    title="QuantLab API",
    version="0.1.0",
    description="Portfolio & options analytics engine (Project #1 in Gannon's portfolio).",
)

# CORS (allow localhost frontends)
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "ok", "service": "quantlab-api"}


app.include_router(health.router, prefix="/api/v1")
app.include_router(portfolio.router, prefix="/api/v1")
app.include_router(options.router, prefix="/api/v1")
