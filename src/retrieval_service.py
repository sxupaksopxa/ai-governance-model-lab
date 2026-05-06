from services.chroma_service import query_similar_cases

def get_similar_cases(input_text: str, top_k: int = 3):
    result = query_similar_cases(input_text, top_k)

    cases = []

    for i in range(len(result["ids"][0])):
        cases.append({
            "id": result["ids"][0][i],
            "text": result["documents"][0][i],
            "metadata": result["metadatas"][0][i],
            "distance": result["distances"][0][i],
        })

    return cases