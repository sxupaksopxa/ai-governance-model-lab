from transformers import AutoTokenizer, AutoModelForSequenceClassification

MODEL_DIR = "models/ai-risk-classifier-roberta"
REPO_NAME = "Begai/ai-risk-classifier-roberta"

tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_DIR)

model.push_to_hub(REPO_NAME)
tokenizer.push_to_hub(REPO_NAME)

print("Model pushed to Hugging Face Hub!")