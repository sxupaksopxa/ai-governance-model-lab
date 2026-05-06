# Short User Manual

## Purpose

AI Governance Model Lab helps users classify AI use cases and explore governance-oriented guidance using AI models and semantic similarity retrieval.

---

## How to Use

### Step 1 — Open the Web Application

Access the deployed frontend in the browser.

---

### Step 2 — Enter AI Use Case

Describe the AI system or use case in natural language.

Example:

```text
An AI system analyzes job applications and recommends candidates for interviews.
```

---

### Step 3 — Run Classification

Click:

```text
Classify Use Case
```

The system sends the request to the backend AI service.

---

## Results

The application returns:

### Risk Priority

Predicted governance-oriented risk category.

### Confidence Score

Model confidence for the selected label.

### Similar Cases

Semantically similar governance examples retrieved from ChromaDB.

---

## Technical Notes

* The frontend is hosted on Vercel.
* The backend API is hosted on Render.
* The classification model is hosted on Hugging Face.
* Similarity retrieval uses ChromaDB and sentence-transformers embeddings.

---

## Current Limitations

* Prototype-stage governance logic
* Limited training dataset
* Retrieval quality depends on indexed examples
* Results should be reviewed by humans

---

## Intended Audience

* AI governance learners
* Technical architects
* Compliance and risk teams
* AI experimentation projects
* Educational demonstrations

---

## Support

This project is currently maintained as an independent learning and portfolio initiative.