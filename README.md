# AI Governance Model Lab

## Overview

AI Governance Model Lab is a practical AI project focused on AI governance, risk classification, and semantic retrieval.

The idea behind the project was to better understand how modern AI systems can be combined into a working end-to-end application instead of only experimenting in notebooks.

The project combines:

* Fine-tuned RoBERTa classification model
* FastAPI backend
* React + Vite frontend
* ChromaDB similarity retrieval
* Hugging Face model hosting
* Cloud deployment with Render and Vercel


Users can describe an AI use case in natural language and receive:

- a predicted governance-oriented risk label,
- confidence information,
- and semantically similar AI governance examples.

---

# Live Architecture

## Frontend

* React + Vite
* Hosted on Vercel

## Backend

* FastAPI
* Hosted on Render

## AI Components

### Classification

* Fine-tuned RoBERTa model
* Hosted via Hugging Face

### Retrieval

* sentence-transformers/all-MiniLM-L6-v2
* ChromaDB vector database
* Similar case retrieval

---

## Features

- Custom dataset (~90 curated AI governance and risk assessment use cases)
- Fine-tuned RoBERTa model for governance-oriented risk classification
- FastAPI backend for real-time AI inference
- React + Vite frontend for interactive testing and experimentation
- Probability-based output and confidence scoring for transparency
- Semantic similarity search using Sentence Transformers embeddings
- ChromaDB vector database for retrieval of related governance examples
- Explainable results through similar real-world AI use cases
- Cloud deployment architecture using Render (backend) and Vercel (frontend)
- Hugging Face model hosting and integration
- REST API communication between frontend and backend services
- Retrieval-augmented workflow combining classification and semantic search
- End-to-end AI deployment pipeline with GitHub integration
- Practical AI engineering setup including model serving, vector search, and cloud deployment
- Clean user interface with confidence scores, risk labels, and similar case retrieval

---

# Example Workflow

1. User enters AI use case description.
2. Frontend sends request to FastAPI backend.
3. RoBERTa model predicts governance risk priority.
4. ChromaDB retrieves semantically similar cases.
5. Results are displayed in the frontend.

---

### Example 1
Input:
"We use AI to summarize internal meeting notes."

Output:
Lower Risk
Confidence: 94.4%

### Example 2
Input:
"A system ranks insurance claims for staff review."

Output:
Possible High Risk
Confidence: 91.3%

### Example 3
Input:
"An AI system automatically rejects job applicants."

Output:
Likely High Risk
Confidence: 96.2%

### Example 4
Input:
"An AI system automatically rejects job applicants."

Output:
Potentially Prohibited
Confidence: 93.3%

---

# Technology Stack

## Frontend

* React
* Vite
* JavaScript

## Backend

* Python
* FastAPI
* Uvicorn

## AI / ML

* Hugging Face Transformers
* PyTorch
* Sentence Transformers
* ChromaDB

## Deployment

* Vercel
* Render
* Hugging Face Hub

---

# Local Development

## Backend

```bash
pip install -r requirements.txt
uvicorn src.api:app --reload
```

## Frontend

```bash
npm install
npm run dev
```

---

# Environment Variables

## Frontend

```env
VITE_API_URL=https://ai-governance-model-lab.onrender.com
```

---

# Future Improvements

* Improved governance recommendations
* Enhanced retrieval ranking
* Expanded training dataset
* Better UI/UX visualization
* Explainable AI output
* Evaluation metrics dashboard
* Multi-language support

---

# Disclaimer

This project is a learning and research prototype focused on AI governance workflows and educational exploration. It does not provide legal or regulatory advice.