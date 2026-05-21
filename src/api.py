import os
import json
from contextlib import asynccontextmanager

import torch
import chromadb
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from sentence_transformers import SentenceTransformer

from src.chroma_retrieval import find_similar_cases_chroma

MODEL_DIR = os.getenv("MODEL_DIR", "Begai/ai-risk-classifier-roberta")
CHROMA_PATH = os.getenv("CHROMA_PATH", "./chroma_db")
EMBEDDING_MODEL_NAME = os.getenv(
    "EMBEDDING_MODEL_NAME", "sentence-transformers/all-MiniLM-L6-v2"
)

MAX_INPUT_LENGTH = 2000

app_state = {}


class PredictionRequest(BaseModel):
    text: str = Field(
        ...,
        min_length=1,
        max_length=MAX_INPUT_LENGTH,
        description="AI use case description to classify",
    )


class PredictionResponse(BaseModel):
    label: str
    confidence: float
    probabilities: dict[str, float]
    similar_cases: list[dict]


@asynccontextmanager
async def lifespan(app: FastAPI):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)
    model = AutoModelForSequenceClassification.from_pretrained(MODEL_DIR)
    model = model.to(device)
    model.eval()

    embedding_model = SentenceTransformer(EMBEDDING_MODEL_NAME)

    client = chromadb.PersistentClient(path=CHROMA_PATH)
    collection = client.get_or_create_collection(name="ai_use_cases")

    app_state["device"] = device
    app_state["tokenizer"] = tokenizer
    app_state["model"] = model
    app_state["embedding_model"] = embedding_model
    app_state["collection"] = collection

    yield

    app_state.clear()


app = FastAPI(
    title="AI Governance Model API",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://ai-governance-model-lab.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Authorization"],
)


@app.get("/")
def health_check():
    return {"status": "ok", "message": "AI Governance Model API is running"}


def _predict(text: str) -> tuple[str, float, dict[str, float]]:
    tokenizer = app_state["tokenizer"]
    model = app_state["model"]
    device = app_state["device"]

    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=160,
    )
    inputs = {k: v.to(device) for k, v in inputs.items()}

    with torch.no_grad():
        outputs = model(**inputs)

    probabilities_tensor = torch.softmax(outputs.logits, dim=-1)[0]
    predicted_id = torch.argmax(probabilities_tensor).item()

    probabilities = {
        model.config.id2label[i]: round(prob.item(), 4)
        for i, prob in enumerate(probabilities_tensor)
    }

    label = model.config.id2label[predicted_id]
    confidence = round(probabilities_tensor[predicted_id].item(), 4)

    return label, confidence, probabilities


@app.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    try:
        label, confidence, probabilities = _predict(request.text)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Inference failed: {exc}")

    try:
        similar_cases = find_similar_cases_chroma(request.text)
    except Exception as exc:
        similar_cases = []

    return {
        "label": label,
        "confidence": confidence,
        "probabilities": probabilities,
        "similar_cases": similar_cases,
    }


@app.post("/predict-chroma", response_model=PredictionResponse)
def predict_chroma(request: PredictionRequest):
    """Alias for /predict. Kept for backward compatibility."""
    return predict(request)
