from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch


MODEL_DIR = "models/ai-risk-classifier"

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


tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_DIR)
model.eval()


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

    return {
        "label": label,
        "confidence": confidence,
        "probabilities": probabilities,
    }