import json
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch


MODEL_DIR = "models/ai-risk-classifier-roberta"
DATA_PATH = "data/evaluation_cases.jsonl"


tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_DIR)
model.eval()


def predict(text: str):
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
    predicted_id = torch.argmax(probabilities).item()

    label = model.config.id2label[predicted_id]
    confidence = probabilities[predicted_id].item()

    return label, confidence


def load_cases(path: str):
    cases = []

    with open(path, "r") as file:
        for line in file:
            cases.append(json.loads(line))

    return cases


def main():
    cases = load_cases(DATA_PATH)

    total = len(cases)
    correct = 0
    wrong_cases = []

    for case in cases:
        predicted_label, confidence = predict(case["text"])
        expected_label = case["expected_label"]

        is_correct = predicted_label == expected_label

        if is_correct:
            correct += 1
        else:
            wrong_cases.append({
                "text": case["text"],
                "expected": expected_label,
                "predicted": predicted_label,
                "confidence": round(confidence, 4),
            })

        status = "OK" if is_correct else "WRONG"

        print(f"\n[{status}]")
        print(f"Text: {case['text']}")
        print(f"Expected: {expected_label}")
        print(f"Predicted: {predicted_label}")
        print(f"Confidence: {round(confidence, 4)}")

    accuracy = correct / total if total else 0

    print("\n====================")
    print("Evaluation Summary")
    print("====================")
    print(f"Total cases: {total}")
    print(f"Correct: {correct}")
    print(f"Wrong: {len(wrong_cases)}")
    print(f"Accuracy: {round(accuracy * 100, 2)}%")

    if wrong_cases:
        print("\nWrong cases:")
        for item in wrong_cases:
            print("-" * 40)
            print(f"Text: {item['text']}")
            print(f"Expected: {item['expected']}")
            print(f"Predicted: {item['predicted']}")
            print(f"Confidence: {item['confidence']}")


if __name__ == "__main__":
    main()