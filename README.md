# AI Governance Model Lab

AI Governance Model Lab is a governance-focused AI assessment platform designed to classify AI use cases according to potential governance and regulatory risk patterns.
The platform combines:
- Fine-tuned AI governance classification
- Semantic retrieval of comparable governance cases
- Explainability-oriented assessment logic
- Governance-focused UI and assessment workflow

The project is designed as a practical governance support tool for SMEs, consultants, governance teams, and organizations exploring AI adoption.

# Governance-Focused Classification

The application evaluates AI use cases and classifies them into governance-oriented categories:
- Lower Risk
- Possible High Risk
- Likely High Risk
- Potentially Prohibited

The classification logic is based on a fine-tuned RoBERTa model trained on governance-oriented AI use cases.

# Comparable Governance Cases

The platform retrieves semantically related governance examples using ChromaDB vector retrieval and BAAI embeddings.

This helps users:
- understand similar governance scenarios
- compare risk patterns
- identify nearby governance boundaries
- improve explainability and trust

## Live Demo

Frontend:
https://ai-governance-model-lab.vercel.app

Backend API:
https://ai-governance-model-lab.onrender.com/docs

---

# Live Architecture

## Frontend

* React + Vite + CSS
* Hosted on Vercel

## Backend

* FastAPI
* Python
* Hosted on Render

## AI Components

### Classification

* Fine-tuned RoBERTa model
* Hosted via Hugging Face

### Retrieval

* Hugging Face Transformers
* Sentence Transformers
* ChromaDB vector database
* Similar case retrieval: BAAI/bge-base-en-v1.5 embeddings

---

## Features

- Custom dataset (~200 curated AI governance and risk assessment use cases)
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

## Practical deployment challenges

The deployment process also involved solving practical engineering challenges such as:
- Cloud memory limitations,
- Model loading and hosting,
- API routing,
- CORS configuration,
- Vector database initialization,
- Frontend/Backend integration.


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
"A company uses AI to manipulate vulnerable users into buying financial products."

Output:
Potentially Prohibited
Confidence: 93.5%

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

## Architecture Diagram

Frontend (Vercel)

        ↓
FastAPI Backend (Render)

        ↓
RoBERTa Model (HF Hub)

        ↓
ChromaDB Semantic Retrieval

        ↓
Comparable Gevernance Cases

---

# Environment Variables

## Frontend

```env
VITE_API_URL=https://ai-governance-model-lab.onrender.com
```

# Privacy & Data Minimization

The platform is designed with privacy and data minimization principles in mind.

Users should not submit:
- confidential company information
- personal data
- proprietary information
- internal identifiers

Future governance telemetry and feedback features are planned with anonymization and GDPR-oriented design considerations.

---

# Future Improvements

* governance feedback loops
* suggested governance actions
* governance metadata extraction
* PDF assessment export
* anonymized governance telemetry
* expanded explainability features
* additional governance domains and datasets
* Multi-language support


# Known Limitations

This platform:
- provides governance-oriented guidance
- is not legal advice
- is not a formal EU AI Act conformity assessment
- may produce uncertain or boundary classifications
- should be used as governance support tooling

---

# License

This project is currently shared for portfolio, educational, and governance experimentation purposes.