import { useState } from "react";
import "./App.css";

const API_URL = "http://127.0.0.1:8000/predict";

export default function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const LABEL_MAP = {
    lower_risk: "Lower Risk",
    possible_high_risk: "Possible High Risk",
    likely_high_risk: "Likely High Risk",
    potentially_prohibited: "Potentially Prohibited",
  };

  const COLOR_MAP = {
    lower_risk: "#2ecc71",
    possible_high_risk: "#f1c40f",
    likely_high_risk: "#e67e22",
    potentially_prohibited: "#e74c3c",
  };
  
  const EXPLANATIONS = {
    lower_risk: "The AI system provides informational support and does not impact decisions about people.",
    possible_high_risk: "The AI system influences decisions, but humans remain fully responsible.",
    likely_high_risk: "The AI system directly affects outcomes for individuals.",
    potentially_prohibited: "The AI system may involve harmful, manipulative, or unfair practices.",
  };

  const EXAMPLES = [
    "A system ranks insurance claims for staff review.",
    "An AI system automatically rejects job applicants.",
    "A company uses AI to manipulate vulnerable users into buying financial products.",
  ];

  async function handlePredict() {
    if (!text.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Prediction request failed");
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <h1>AI Governance Model Lab</h1>
      <p>
        Enter an AI use case and classify it with your trained Hugging Face
        model.
      </p>

      <div className="input-area">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Example: A system ranks insurance claims for staff review."
        />

        <button onClick={handlePredict} disabled={loading}>
          {loading ? "Classifying..." : "Classify use case"}
        </button>
      </div>

      {result && (
        <section className="result-card">
          <h2 style={{ color: COLOR_MAP[result.label] }}>
            {LABEL_MAP[result.label]}
          </h2>

          <p>Confidence: {(result.confidence * 100).toFixed(1)}%</p>

          <h3>Probabilities</h3>

          {Object.entries(result.probabilities).map(([label, value]) => (
            <div className="probability-row" key={label}>
              <span>{LABEL_MAP[label]}</span>
              <strong>{(value * 100).toFixed(1)}%</strong>
            </div>
          ))}
          
          <p className="similar-help">
            Similar cases are retrieved from the training dataset using embedding similarity.
          </p>
          
          {result.similar_cases && (
            <>
              <h3>Similar cases</h3>

              {result.similar_cases.map((item, index) => {
                const isMatch = item.label === result.label;

                return (
                  <div
                    className={`similar-case ${isMatch ? "match" : "different"}`}
                    key={index}
                  >
                    <p>{item.text}</p>

                    <small>
                      <span className="case-label">
                        {isMatch ? "✓ Same risk level" : "○ Different risk level"}
                      </span>
                      {" · "}
                      {LABEL_MAP[item.label]} · Similarity:{" "}
                      {(item.similarity * 100).toFixed(1)}%
                    </small>
                  </div>
                );
              })}
            </>
          )}

          <p>{EXPLANATIONS[result.label]}</p>
          
        </section>
      )}
    </main>
  );
}