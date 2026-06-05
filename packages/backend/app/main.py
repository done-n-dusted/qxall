"""qxall backend – FastAPI application entry point."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="qxall API", version="0.1.0")

# ---------------------------------------------------------------------------
# CORS – allow the Vite dev server during local development
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@app.get("/api")
async def root():
    """Root API endpoint."""
    return {"message": "qxall API"}


@app.get("/api/health")
async def health_check():
    """Health-check endpoint used by monitoring and CI."""
    return {"status": "ok", "app": "qxall"}
