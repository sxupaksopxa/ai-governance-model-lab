from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
from src.chroma_retrieval import find_similar_cases_chroma

MODEL_DIR = "distilbert-base-uncased-finetuned-sst-2-english"

app = FastAPI(title="AI Governance Model API")

from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://ai-governance-model-lab.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictionRequest(BaseModel):
    text: str

class PredictionResponse(BaseModel):
    label: str
    confidence: float
    probabilities: dict[str, float]
    similar_cases: list[dict]

tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_DIR)
model.eval()

# Embedding setup
import json
from sentence_transformers import SentenceTransformer, util

EMBEDDING_MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
DATA_PATH = "data/training_data.jsonl"

embedding_model = SentenceTransformer(EMBEDDING_MODEL_NAME)


def load_cases(path):
    cases = []
    with open(path, "r") as f:
        for line in f:
            cases.append(json.loads(line))
    return cases


training_cases = load_cases(DATA_PATH)
case_texts = [case["text"] for case in training_cases]
case_embeddings = embedding_model.encode(case_texts, convert_to_tensor=True)

import chromadb
from sentence_transformers import SentenceTransformer

client = chromadb.PersistentClient(path="./chroma_db")
collection = client.get_collection(name="ai_use_cases")

embedding_model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")


def find_similar_cases(text, top_k=3):
    embedding = embedding_model.encode([text]).tolist()

    results = collection.query(
        query_embeddings=embedding,
        n_results=top_k
    )

    similar_cases = []

    for i in range(len(results["documents"][0])):
        similar_cases.append({
            "text": results["documents"][0][i],
            "label": results["metadatas"][0][i]["label"],
            "similarity": round(1 - results["distances"][0][i], 4)
        })

    return similar_cases

@app.get("/")
def health_check():
    return {"status": "ok", "message": "AI Governance Model API is running"}


@app.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    inputs = tokenizer(
        request.text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=160,
    )

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
    
    similar_cases = find_similar_cases_chroma(request.text)

    return {
        "label": label,
        "confidence": confidence,
        "probabilities": probabilities,
        "similar_cases": similar_cases,
    }

@app.post("/predict-chroma", response_model=PredictionResponse)
def predict_chroma(request: PredictionRequest):
    inputs = tokenizer(
        request.text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=160,
    )

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

    similar_cases = find_similar_cases_chroma(request.text)

    return {
        "label": label,
        "confidence": confidence,
        "probabilities": probabilities,
        "similar_cases": similar_cases,
    }