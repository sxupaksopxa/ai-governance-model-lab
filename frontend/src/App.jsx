import { useState, useRef, useCallback, useEffect } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const MAX_INPUT_LENGTH = 400;

const LABEL_MAP = {
  lower_risk: "Lower Risk",
  possible_high_risk: "Possible High Risk",
  likely_high_risk: "Likely High Risk",
  potentially_prohibited: "Potentially Prohibited",
};

const COLOR_MAP = {
  lower_risk: "#16a34a",
  possible_high_risk: "#ca8a04",
  likely_high_risk: "#dc2626",
  potentially_prohibited: "#7f1d1d",
};

const BG_MAP = {
  lower_risk: "#dcfce7",
  possible_high_risk: "#fef9c3",
  likely_high_risk: "#fee2e2",
  potentially_prohibited: "#fee2e2",
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

function Spinner() {
  return (
    <span className="spinner">
      <span className="spinner-circle" />
    </span>
  );
}

function getSimilarityLabel(score) {
  if (score >= 0.78) return "Strong match";
  if (score >= 0.60) return "Related case";
  return "Weak match";
}

function MethodologyPage({ onBack }) {
  return (
    <div className="frame method-frame">
      <button className="btn-back" onClick={onBack} type="button">
        &#8592; Back
      </button>

      <h1>Methodology</h1>

      <section className="method-section">
        <h2>What this lab does</h2>
        <p>
          AI Governance Model Lab combines three capabilities to assess AI use
          cases from a regulatory and risk perspective:
        </p>
        <ul className="method-list">
          <li>
            <strong>Governance-focused AI classification</strong> &mdash;
            Categorizes use cases into EU AI Act-aligned risk tiers
          </li>
          <li>
            <strong>Semantic retrieval of comparable governance cases</strong> &mdash;
            Surfaces historically similar use cases from the training corpus
          </li>
          <li>
            <strong>Explainability-oriented assessment logic</strong> &mdash;
            Provides human-readable explanations for every prediction
          </li>
        </ul>
      </section>

      <section className="method-section">
        <h2>Core technologies</h2>
        <ul className="method-list tech-list">
          <li>
            <strong>Fine-tuned RoBERTa</strong> (roberta-base) &mdash;
            Sequence-classification head trained on labeled governance cases
          </li>
          <li>
            <strong>ChromaDB</strong> &mdash; Persistent vector store for nearest-neighbour case retrieval
          </li>
          <li>
            <strong>BAAI/bge-base-en-v1.5</strong> &mdash; Sentence embeddings for semantic similarity matching
          </li>
        </ul>
      </section>

      <section className="method-section">
        <h2>How a request is processed</h2>
        <ol className="method-list numbered">
          <li>
            The input text is tokenized and fed into the fine-tuned RoBERTa model.
          </li>
          <li>
            The model outputs class probabilities across four risk tiers:
            Lower Risk, Possible High Risk, Likely High Risk, and Potentially Prohibited.
          </li>
          <li>
            The input is also embedded via BAAI/bge-base-en-v1.5 and queried
            against ChromaDB to retrieve the most semantically similar training cases.
          </li>
          <li>
            Retrieved cases are filtered by relevance threshold, labelled as
            Strong match, Related case, or Weak match, and presented for human review.
          </li>
        </ol>
      </section>
    </div>
  );
}

function AboutPage({ onBack }) {
  return (
    <div className="frame method-frame">
      <button className="btn-back" onClick={onBack} type="button">
        &#8592; Back
      </button>

      <h1>About</h1>

      <section className="method-section">
        <h2>Who this is for</h2>
        <p>
          Small and medium companies, governance teams, consultants, HR, finance,
          insurance, and public-sector teams that need an initial view of AI governance risk.
        </p>
      </section>

      <section className="method-section">
        <h2>Suggested governance actions</h2>
        <p>
          Based on the classification, the tool can highlight practical next steps such as:
        </p>
        <ul className="method-list">
          <li>Documenting human oversight</li>
          <li>Reviewing decision impact</li>
          <li>Checking bias risks</li>
          <li>Preparing governance evidence</li>
        </ul>
      </section>

      <section className="method-section">
        <h2>Known limitations</h2>
        <p>
          This tool provides governance-oriented guidance and does not replace legal advice,
          formal conformity assessment, or expert compliance review.
        </p>
      </section>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSimilar, setShowSimilar] = useState(false);
  const abortRef = useRef(null);
  const textareaRef = useRef(null);
  const resultRef = useRef(null);

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [result]);

  const handlePredict = useCallback(async () => {
    if (!text.trim()) return;

    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setResult(null);
    setShowSimilar(false);

    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Prediction request failed (${response.status})`);
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      if (error.name === "AbortError") {
        setResult({ error: "Request timed out. Please try again." });
      } else {
        setResult({ error: error.message });
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }, [text]);

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handlePredict();
    }
  };

  const loadExample = (example) => {
    setText(example);
    setResult(null);
    setShowSimilar(false);
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  const visibleCases =
    result && result.similar_cases
      ? result.similar_cases.filter((item) => item.similarity >= 0.55)
      : [];

  return (
    <div className="app">
      <header className="top-nav">
        <span
          className="top-nav-item"
          onClick={() => setPage("home")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") setPage("home");
          }}
        >
          Home
        </span>
        <span className="top-nav-sep">&middot;</span>
        <span
          className="top-nav-item"
          onClick={() => setPage("methodology")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") setPage("methodology");
          }}
        >
          Methodology
        </span>
        <span className="top-nav-sep">&middot;</span>
        <span
          className="top-nav-item"
          onClick={() => setPage("about")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") setPage("about");
          }}
        >
          About
        </span>
      </header>

      <main className="container">
        {page === "methodology" ? (
          <MethodologyPage onBack={() => setPage("home")} />
        ) : page === "about" ? (
          <AboutPage onBack={() => setPage("home")} />
        ) : (
          <div className="frame">
            <h1>AI Governance Model Lab</h1>
            <p className="subtitle">
              Evaluate AI systems using a governance-focused classification model.
            </p>

            <div className="input-group">
              <label htmlFor="usecase" className="input-label">
                AI Use Case Description
              </label>
              <div className="textarea-wrap">
                <textarea
                  id="usecase"
                  ref={textareaRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Example: A system ranks insurance claims for staff review."
                  maxLength={MAX_INPUT_LENGTH}
                  disabled={loading}
                  rows={4}
                />
                <span className="char-count">
                  {text.length}/{MAX_INPUT_LENGTH}
                </span>
              </div>

              <button
                className="btn-primary"
                onClick={handlePredict}
                disabled={loading || !text.trim()}
              >
                {loading ? (
                  <>
                    <Spinner /> Analyzing...
                  </>
                ) : (
                  "Classify use case"
                )}
              </button>
            </div>

            <div className="examples">
              <span className="examples-label">Try an example:</span>
              <div className="example-list">
                {EXAMPLES.map((example) => (
                  <button
                    key={example}
                    className="example-chip"
                    onClick={() => loadExample(example)}
                    disabled={loading}
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            {result && result.error && (
              <section ref={resultRef} className="result-card error">
                <h2>Error</h2>
                <p>{result.error}</p>
                <button
                  className="btn-retry"
                  onClick={handlePredict}
                  disabled={loading || !text.trim()}
                  type="button"
                >
                  Try again
                </button>
              </section>
            )}

            {result && !result.error && (
              <section ref={resultRef} className="result-card">
                <div
                  className="prediction-badge"
                  style={{
                    color: COLOR_MAP[result.label],
                    background: BG_MAP[result.label],
                  }}
                >
                  {LABEL_MAP[result.label]}
                </div>

                <p className="prediction-prob">
                  Model probability:{" "}
                  <strong>{(result.confidence * 100).toFixed(1)}%</strong>
                </p>

                <div className="prob-section">
                  <h4>Probabilities</h4>
                  {Object.entries(result.probabilities)
                    .sort(([, a], [, b]) => b - a)
                    .map(([label, value]) => {
                      const isWinner = label === result.label;
                      return (
                        <div
                          className={`prob-bar ${isWinner ? "winner" : ""}`}
                          key={label}
                        >
                          <div
                            className={`prob-label ${
                              isWinner ? "winner" : ""
                            }`}
                          >
                            {LABEL_MAP[label]}
                          </div>
                          <div className="prob-track">
                            <div
                              className={`prob-fill ${
                                isWinner ? "winner" : ""
                              }`}
                              style={{
                                width: `${value * 100}%`,
                                background: COLOR_MAP[label],
                              }}
                            />
                          </div>
                          <div
                            className={`prob-value ${
                              isWinner ? "winner" : ""
                            }`}
                          >
                            {(value * 100).toFixed(1)}%
                          </div>
                        </div>
                      );
                    })}
                </div>

                <div className="explanation">
                  <h4>Assessment</h4>
                  <p>{EXPLANATIONS[result.label]}</p>
                </div>

                {visibleCases.length > 0 && (
                  <div className="similar-section">
                    <button
                      className="similar-toggle"
                      onClick={() => setShowSimilar((s) => !s)}
                      type="button"
                    >
                      <span>
                        Comparable Governance Cases ({visibleCases.length})
                      </span>
                      <span
                        className={`chevron${showSimilar ? " open" : ""}`}
                      >
                        &#9662;
                      </span>
                    </button>

                    {showSimilar && (
                      <div className="similar-list">
                        {visibleCases.map((item) => {
                          const isMatch = item.label === result.label;
                          return (
                            <div
                              className={`similar-case ${
                                isMatch ? "match" : "different"
                              }`}
                              key={item.text}
                              style={{
                                borderLeftColor: COLOR_MAP[item.label],
                              }}
                            >
                              <p>{item.text}</p>
                              <div className="similar-meta">
                                <span
                                  className={`meta-badge ${
                                    isMatch ? "match" : ""
                                  }`}
                                >
                                  {isMatch ? "Same risk" : "Different"}
                                </span>
                                <span>{LABEL_MAP[item.label]}</span>
                                <span className="meta-sep">&middot;</span>
                                <span className="sim-label">
                                  {getSimilarityLabel(item.similarity)}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </section>
            )}
          </div>
        )}

        <footer className="footer">
          <p>
            &copy; 2026 BKlein Digital Labs &mdash; AI Governance Model Lab
          </p>
        </footer>
      </main>
    </div>
  );
}
