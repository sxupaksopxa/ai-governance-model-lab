import os

BACKEND = os.getenv("RETRIEVAL_BACKEND", "memory")

if BACKEND == "chroma":
    from src.retrieval_chroma import get_similar_cases
else:
    from src.retrieval_memory import get_similar_cases