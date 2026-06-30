import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Methodology() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Methodology — BKlein Digital Labs";
  }, []);

  return (
    <div className="frame method-frame">
      <button className="btn-back" onClick={() => navigate("/")} type="button">
        &#8592; Back
      </button>

      <h1>Methodology</h1>

      <p className="method-section">
        AI Governance Model Lab combines governance-focused AI classification,
        semantic retrieval, and explainability to support the assessment of AI
        use cases from a regulatory and risk perspective.
      </p>

      <section className="method-section">
        <h2>What this lab does</h2>

        <ul className="method-list">
          <li>
            <strong>Governance-focused AI classification</strong> — Categorizes
            AI use cases into governance-oriented risk levels aligned with the
            EU AI Act.
          </li>

          <li>
            <strong>Semantic retrieval of comparable governance cases</strong>
            — Retrieves similar historical AI use cases using vector search.
          </li>

          <li>
            <strong>Explainability-oriented assessment</strong> — Provides
            transparent explanations to support human decision-making.
          </li>
        </ul>
      </section>

      <section className="method-section">
        <h2>Core Technologies</h2>

        <ul className="method-list">
          <li>
            <strong>RoBERTa (Fine-tuned)</strong> — Governance-focused AI
            classification.
          </li>

          <li>
            <strong>ChromaDB</strong> — Persistent vector database for semantic
            retrieval.
          </li>

          <li>
            <strong>BAAI/bge-base-en-v1.5</strong> — Embedding model used to
            identify comparable governance cases.
          </li>
        </ul>
      </section>

      <section className="method-section">
        <h2>Assessment Workflow</h2>

        <ol className="method-list numbered">
          <li>User submits an AI use case description.</li>

          <li>
            The fine-tuned RoBERTa model predicts one of four governance risk
            categories.
          </li>

          <li>
            The same input is converted into an embedding using
            BAAI/bge-base-en-v1.5.
          </li>

          <li>
            ChromaDB retrieves semantically similar governance cases.
          </li>

          <li>
            The application presents the prediction, confidence score,
            explanation, and comparable governance cases for human review.
          </li>
        </ol>
      </section>

      <section className="method-section">
        <h2>Current Limitations</h2>

        <ul className="method-list">
          <li>Experimental governance-focused prototype.</li>
          <li>Does not replace legal or regulatory advice.</li>
          <li>Supports human decision-making rather than automated decisions.</li>
          <li>Continuously evolving with additional governance scenarios.</li>
        </ul>
      </section>
    </div>
  );
}
