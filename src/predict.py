from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

MODEL_DIR = "models/ai-risk-classifier-roberta"


def predict(text: str, tokenizer, model, device):
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

    probabilities = torch.softmax(outputs.logits, dim=-1)[0]
    predicted_id = torch.argmax(probabilities).item()

    label = model.config.id2label[predicted_id]
    confidence = probabilities[predicted_id].item()

    probs_dict = {
        model.config.id2label[i]: round(prob.item(), 4)
        for i, prob in enumerate(probabilities)
    }

    return label, confidence, probs_dict


def main():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)
    model = AutoModelForSequenceClassification.from_pretrained(MODEL_DIR)
    model = model.to(device)
    model.eval()

    examples = [
        "We use AI to summarize internal meeting notes.",
        "An AI system recommends which job applicants should be rejected.",
        "A company uses AI to manipulate vulnerable users into buying financial products.",
        "A system ranks insurance claims for staff review.",
    ]

    for text in examples:
        label, confidence, probs = predict(text, tokenizer, model, device)

        print("\nText:", text)
        print(f"Predicted: {label} (confidence: {round(confidence, 4)})")
        for class_name, score in probs.items():
            print(f"  {class_name}: {score}")


if __name__ == "__main__":
    main()
