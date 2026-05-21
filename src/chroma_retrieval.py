import chromadb
from sentence_transformers import SentenceTransformer

EMBEDDING_MODEL_NAME = "BAAI/bge-base-en-v1.5"

embedding_model = SentenceTransformer(EMBEDDING_MODEL_NAME)

client = chromadb.PersistentClient(path="./chroma_db")
collection = client.get_or_create_collection(name="ai_use_cases")


def find_similar_cases_chroma(text, top_k=3):
    embedding = embedding_model.encode([text]).tolist()

    results = collection.query(
        query_embeddings=embedding,
        n_results=top_k,
        include=["documents", "metadatas", "distances"],
    )

    similar_cases = []

    for i in range(len(results["documents"][0])):
        distance = float(results["distances"][0][i])
        similarity = 1 / (1 + distance)

        similar_cases.append({
            "text": results["documents"][0][i],
            "label": results["metadatas"][0][i]["label"],
            "similarity": round(similarity, 4),
        })

    return similar_cases