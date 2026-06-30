import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Privacy() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Privacy Policy \u2014 BKlein Digital Labs";
  }, []);

  return (
    <div className="frame method-frame">
      <button className="btn-back" onClick={() => navigate("/")} type="button">
        &#8592; Back
      </button>

      <h1>Privacy Policy</h1>
      <p className="method-updated">Last updated: June 30, 2026</p>

      <section className="method-section">
        <h2>1. Overview</h2>
        <p>
          BKlein Digital Labs respects your privacy. This policy explains what
          information is processed when using AI Governance Model Lab.
        </p>
      </section>

      <section className="method-section">
        <h2>2. Information We Collect</h2>
        <p>
          This website does not use cookies, analytics, tracking scripts, user
          accounts, or a user database.
        </p>
        <p>
          If you contact us by email, we receive only the information you choose
          to include in your message.
        </p>
      </section>

      <section className="method-section">
        <h2>3. AI Use Case Processing</h2>
        <p>
          When you submit an AI use case description, the text is sent to the
          backend API for classification and semantic retrieval.
        </p>
        <p>
          The application is intended for non-confidential AI governance
          examples. Do not submit personal, sensitive, confidential, or regulated
          information.
        </p>
      </section>

      <section className="method-section">
        <h2>4. Data Retention</h2>
        <p>
          Submitted use case descriptions are processed for the purpose of
          generating a classification result. The current application does not
          provide user accounts or long-term user history.
        </p>
      </section>

      <section className="method-section">
        <h2>5. Third-Party Services</h2>
        <p>
          The frontend is hosted on Vercel. The backend may be hosted on a
          separate cloud service. These providers may process technical server
          logs for operational and security purposes.
        </p>
      </section>

      <section className="method-section">
        <h2>6. Your Rights</h2>
        <p>
          You may contact BKlein Digital Labs regarding privacy questions at{" "}
          <a href="mailto:contact@bkleindigital.com">
            contact@bkleindigital.com
          </a>.
        </p>
      </section>

      <section className="method-section">
        <h2>7. Contact</h2>
        <p>
          Questions about this policy can be sent to{" "}
          <a href="mailto:contact@bkleindigital.com">
            contact@bkleindigital.com
          </a>.
        </p>
      </section>
    </div>
  );
}
