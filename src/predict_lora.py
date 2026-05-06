from pathlib import Path
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from peft import PeftModel
import torch


PROJECT_ROOT = Path(__file__).resolve().parents[1]

BASE_MODEL = "roberta-base"
LORA_DIR = PROJECT_ROOT / "models" / "ai-risk-classifier-roberta-lora"

labels = [
    "lower_risk",
    "possible_high_risk",
    "likely_high_risk",
    "potentially_prohibited",
]

label2id = {label: i for i, label in enumerate(labels)}
id2label = {i: label for label, i in label2id.items()}

tokenizer = AutoTokenizer.from_pretrained(LORA_DIR)

base_model = AutoModelForSequenceClassification.from_pretrained(
    BASE_MODEL,
    num_labels=len(labels),
    id2label=id2label,
    label2id=label2id,
)

model = PeftModel.from_pretrained(base_model, LORA_DIR)
model.eval()


examples = [
    "We use AI to summarize internal meeting notes.",
    "An AI system recommends which job applicants should be rejected.",
    "A company uses AI to manipulate vulnerable users into buying financial products.",
    "A system ranks insurance claims for staff review.",
]

for text in examples:
    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=160,
    )

    with torch.no_grad():
        outputs = model(**inputs)

    probabilities = torch.softmax(outputs.logits, dim=-1)[0]

    print("\nText:", text)
    for i, prob in enumerate(probabilities):
        print(id2label[i], ":", round(prob.item(), 4))