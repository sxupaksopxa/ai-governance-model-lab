from sentence_transformers import SentenceTransformer, util
import json

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"

model = SentenceTransformer(MODEL_NAME)


# Load your dataset
def load_data(path):
    data = []
    with open(path, "r") as f:
        for line in f:
            row = json.loads(line)
            data.append(row)
    return data


data = load_data("data/training_data.jsonl")


# Prepare texts
texts = [item["text"] for item in data]


# Create embeddings
embeddings = model.encode(texts, convert_to_tensor=True)


# Query function
def find_similar(query, top_k=3):
    query_embedding = model.encode(query, convert_to_tensor=True)

    scores = util.cos_sim(query_embedding, embeddings)[0]

    top_results = scores.topk(k=top_k)

    results = []
    for score, idx in zip(top_results.values, top_results.indices):
        results.append({
            "text": data[idx]["text"],
            "label": data[idx]["label"],
            "score": round(float(score), 4)
        })

    return results


# Test
query = "AI prioritizes loan applications"

results = find_similar(query)

print("\nQUERY:", query)
for r in results:
    print(r)