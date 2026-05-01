from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

MODEL_DIR = "models/ai-risk-classifier-roberta"

app = FastAPI(title="AI Governance Model API")

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
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

def find_similar_cases(text, top_k=3):
    query_embedding = embedding_model.encode(text, convert_to_tensor=True)
    scores = util.cos_sim(query_embedding, case_embeddings)[0]
    top_results = scores.topk(k=top_k)

    results = []
    for score, idx in zip(top_results.values, top_results.indices):
        case = training_cases[int(idx)]
        results.append({
            "text": case["text"],
            "label": case["label"],
            "similarity": round(float(score), 4),
        })

    return results

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
    
    similar_cases = find_similar_cases(request.text)

    return {
        "label": label,
        "confidence": confidence,
        "probabilities": probabilities,
        "similar_cases": similar_cases,
    }