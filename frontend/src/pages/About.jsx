import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function About() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "About — BKlein Digital Labs";
  }, []);

  return (
    <div className="frame method-frame">
      <button className="btn-back" onClick={() => navigate("/")} type="button">
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

export default About;
