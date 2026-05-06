from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import PeftModel
import torch


BASE_MODEL = "Qwen/Qwen2.5-0.5B-Instruct"
LORA_DIR = "models/ai-risk-qwen-lora"

tokenizer = AutoTokenizer.from_pretrained(LORA_DIR)

base_model = AutoModelForCausalLM.from_pretrained(BASE_MODEL)
model = PeftModel.from_pretrained(base_model, LORA_DIR)
model.eval()


def classify(text: str):
    prompt = (
    "### Instruction:\n"
    "Classify this AI use case. Output only one label from: "
    "lower_risk, possible_high_risk, likely_high_risk, potentially_prohibited.\n\n"
    "### AI Use Case:\n"
    f"{text}\n\n"
    "### Response:\n"
)

    inputs = tokenizer(prompt, return_tensors="pt")

    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=10,
            do_sample=False,
            temperature=None,
            top_p=None,
            pad_token_id=tokenizer.eos_token_id,
        )

    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return response.split("### Response:")[-1].strip()


examples = [
    "We use AI to summarize internal meeting notes.",
    "A system ranks insurance claims for staff review.",
    "An AI system recommends which job applicants should be rejected.",
    "A company uses AI to manipulate vulnerable users into buying financial products.",
]

for example in examples:
    print("\nINPUT:", example)
    print("OUTPUT:", classify(example))