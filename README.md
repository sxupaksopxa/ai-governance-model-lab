# AI Governance Model Lab
A machine learning project that classifies AI use cases into risk categories inspired by EU AI governance concepts.

The system distinguishes between:
- Lower Risk (informational use)
- Possible High Risk (decision influence)
- Likely High Risk (decision impact)
- Potentially Prohibited (harmful or unfair practices)

## Features

- Custom dataset of about 90 AI use cases
- Hugging Face text classification model
- FastAPI backend for real-time predictions
- React frontend for interactive testing
- Probability-based output for transparency

## Tech Stack

- Python (Transformers, Datasets, PyTorch)
- FastAPI
- React (Vite)

## Models

Two models were tested:

- DistilBERT baseline model
- RoBERTa fine-tuned model with stronger classification performance

The RoBERTa model produced clearer separation between the four risk categories.

## Run locally

### Backend

uvicorn src.api:app --reload

### Frontend

cd frontend
npm install
npm run dev

## Example

Input:
"A system ranks insurance claims for staff review."

Output:
Possible High Risk (56%)


## Disclaimer

This tool provides indicative classification for educational purposes and does not replace legal or regulatory assessment.