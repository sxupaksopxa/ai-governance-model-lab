from datasets import load_dataset
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    TrainingArguments,
    Trainer,
)
import evaluate
import numpy as np

from peft import LoraConfig, get_peft_model, TaskType

MODEL_NAME = "roberta-base"
DATA_PATH = "data/training_data.jsonl"
OUTPUT_DIR = "models/ai-risk-classifier-roberta-lora"

labels = [
    "lower_risk",
    "possible_high_risk",
    "likely_high_risk",
    "potentially_prohibited",
]

label2id = {label: i for i, label in enumerate(labels)}
id2label = {i: label for label, i in label2id.items()}


dataset = load_dataset("json", data_files=DATA_PATH, split="train")

dataset = dataset.map(
    lambda row: {"labels": label2id[row["label"]]},
    remove_columns=["label"]
)

dataset = dataset.train_test_split(test_size=0.25, seed=42)

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, use_fast=False)


def tokenize(batch):
    return tokenizer(
        batch["text"],
        truncation=True,
        padding="max_length",
        max_length=160,
    )


tokenized = dataset.map(tokenize, batched=True, remove_columns=["text"])

base_model = AutoModelForSequenceClassification.from_pretrained(
    MODEL_NAME,
    num_labels=len(labels),
    id2label=id2label,
    label2id=label2id,
)

lora_config = LoraConfig(
    task_type=TaskType.SEQ_CLS,
    r=8,
    lora_alpha=16,
    lora_dropout=0.1,
    target_modules=["query", "key", "value"],  # ← FIX
    modules_to_save=["classifier"]
)

model = get_peft_model(base_model, lora_config)
model.print_trainable_parameters()

from transformers import DataCollatorWithPadding
data_collator = DataCollatorWithPadding(tokenizer=tokenizer)

accuracy = evaluate.load("accuracy")
f1 = evaluate.load("f1")


def compute_metrics(eval_pred):
    logits, true_labels = eval_pred
    predictions = np.argmax(logits, axis=-1)

    return {
        "accuracy": accuracy.compute(
            predictions=predictions,
            references=true_labels,
        )["accuracy"],
        "f1_macro": f1.compute(
            predictions=predictions,
            references=true_labels,
            average="macro",
        )["f1"],
    }


training_args = TrainingArguments(
    output_dir=OUTPUT_DIR,
    eval_strategy="epoch",
    save_strategy="epoch",
    learning_rate=3e-5,
    per_device_train_batch_size=4,
    per_device_eval_batch_size=4,
    num_train_epochs=12,
    weight_decay=0.01,
    load_best_model_at_end=True,
    metric_for_best_model="f1_macro",
    label_names=["labels"],
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized["train"],
    eval_dataset=tokenized["test"],
    data_collator=data_collator,
    compute_metrics=compute_metrics,
)

trainer.train()
trainer.evaluate()

model.save_pretrained(OUTPUT_DIR)
tokenizer.save_pretrained(OUTPUT_DIR)

print(f"Model saved to: {OUTPUT_DIR}")
