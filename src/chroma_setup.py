import chromadb
import json
from sentence_transformers import SentenceTransformer

MODEL_NAME = "BAAI/bge-base-en-v1.5"
DATA_PATH = "data/training_data.jsonl"

model = SentenceTransformer(MODEL_NAME)

client = chromadb.PersistentClient(path="./chroma_db")
collection = client.get_or_create_collection(name="ai_use_cases")


def load_data():
    data = []
    with open(DATA_PATH, "r") as f:
        for line in f:
            data.append(json.loads(line))
    return data


data = load_data()

texts = [item["text"] for item in data]
embeddings = model.encode(texts).tolist()

ids = [str(i) for i in range(len(data))]

collection.add(
    ids=ids,
    documents=texts,
    embeddings=embeddings,
    metadatas=data,
)

print("Chroma DB created")