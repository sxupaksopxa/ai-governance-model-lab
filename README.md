# AI Governance Model Lab

A machine learning project that classifies AI use cases into risk categories inspired by EU AI governance concepts.

The system distinguishes between:
- Lower Risk (informational use)
- Possible High Risk (decision influence)
- Likely High Risk (decision impact)
- Potentially Prohibited (harmful or unfair practices)

## Features

- Custom dataset (~90 curated AI use cases)
- Fine-tuned RoBERTa model for risk classification
- FastAPI backend for real-time predictions
- React frontend for interactive testing
- Probability-based output for transparency
- Semantic similarity search using embeddings (Sentence Transformers)
- Explainable results via similar real-world cases
- Clean UX with confidence scores and risk breakdown

## Tech Stack

- Python (Transformers, Datasets, PyTorch)
- FastAPI
- React (Vite)
- Sentence Transformers (embeddings)

## Models

Two models were evaluated:

- DistilBERT (baseline)
- RoBERTa (fine-tuned)

The RoBERTa model achieved better separation between risk categories and more stable predictions, and is used in the current system.

## Architecture Overview

The system combines multiple AI components:

- RoBERTa classifier → predicts risk category
- Embedding model → retrieves similar use cases
- UI layer → presents predictions with contextual examples

This combination improves explainability by linking predictions to similar real-world cases.

## Run locally

### Backend

uvicorn src.api:app --reload

### Frontend

cd frontend
npm install
npm run dev

## Examples

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

## Disclaimer

This tool provides indicative classification for educational purposes and does not replace legal or regulatory assessment.