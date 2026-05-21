import random

input_file = "./data/training_data.jsonl"
output_file = "./data/training_data_shuffled.jsonl"

with open(input_file, "r", encoding="utf-8") as f:
    lines = f.readlines()

random.shuffle(lines)

with open(output_file, "w", encoding="utf-8") as f:
    f.writelines(lines)

print(f"Shuffled {len(lines)} lines.")