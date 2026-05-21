import json
from pathlib import Path
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
from sklearn.metrics import classification_report, confusion_matrix, f1_score

MODEL_DIR = "models/ai-risk-classifier-roberta"
DATA_PATH = "data/evaluation_cases.jsonl"
REPORT_PATH = "eval_report.json"


def load_cases(path: str):
    cases = []
    with open(path, "r") as file:
        for line in file:
            cases.append(json.loads(line))
    return cases


def predict_batch(texts: list[str], tokenizer, model, device):
    inputs = tokenizer(
        texts,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=160,
    )
    inputs = {k: v.to(device) for k, v in inputs.items()}

    with torch.no_grad():
        outputs = model(**inputs)

    probs = torch.softmax(outputs.logits, dim=-1)
    predicted_ids = torch.argmax(probs, dim=-1)

    results = []
    for i in range(len(texts)):
        predicted_id = predicted_ids[i].item()
        results.append({
            "label": model.config.id2label[predicted_id],
            "confidence": probs[i][predicted_id].item(),
            "probabilities": {
                model.config.id2label[j]: probs[i][j].item()
                for j in range(probs.size(1))
            },
        })
    return results


def main():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)
    model = AutoModelForSequenceClassification.from_pretrained(MODEL_DIR)
    model = model.to(device)
    model.eval()

    cases = load_cases(DATA_PATH)
    texts = [case["text"] for case in cases]
    expected_labels = [case["expected_label"] for case in cases]

    predictions = predict_batch(texts, tokenizer, model, device)
    predicted_labels = [p["label"] for p in predictions]

    correct = 0
    wrong_cases = []

    for case, pred in zip(cases, predictions):
        is_correct = pred["label"] == case["expected_label"]
        if is_correct:
            correct += 1
        else:
            wrong_cases.append({
                "text": case["text"],
                "expected": case["expected_label"],
                "predicted": pred["label"],
                "confidence": round(pred["confidence"], 4),
            })

        status = "OK" if is_correct else "WRONG"
        print(f"\n[{status}]")
        print(f"Text: {case['text']}")
        print(f"Expected: {case['expected_label']}")
        print(f"Predicted: {pred['label']}")
        print(f"Confidence: {round(pred['confidence'], 4)}")

    total = len(cases)
    accuracy = correct / total if total else 0
    macro_f1 = f1_score(expected_labels, predicted_labels, average="macro")

    print("\n====================")
    print("Evaluation Summary")
    print("====================")
    print(f"Total cases: {total}")
    print(f"Correct: {correct}")
    print(f"Wrong: {len(wrong_cases)}")
    print(f"Accuracy: {round(accuracy * 100, 2)}%")
    print(f"Macro F1: {round(macro_f1, 4)}")

    print("\nClassification Report:")
    print(classification_report(expected_labels, predicted_labels))

    print("Confusion Matrix:")
    print(confusion_matrix(expected_labels, predicted_labels))

    if wrong_cases:
        print("\nWrong cases:")
        for item in wrong_cases:
            print("-" * 40)
            print(f"Text: {item['text']}")
            print(f"Expected: {item['expected']}")
            print(f"Predicted: {item['predicted']}")
            print(f"Confidence: {item['confidence']}")

    report = {
        "total": total,
        "correct": correct,
        "accuracy": round(accuracy, 4),
        "macro_f1": round(macro_f1, 4),
        "classification_report": classification_report(
            expected_labels, predicted_labels, output_dict=True
        ),
        "confusion_matrix": confusion_matrix(
            expected_labels, predicted_labels
        ).tolist(),
        "wrong_cases": wrong_cases,
    }

    with open(REPORT_PATH, "w") as f:
        json.dump(report, f, indent=2)

    print(f"\nReport saved to: {REPORT_PATH}")


if __name__ == "__main__":
    main()
