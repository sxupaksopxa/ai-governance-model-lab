import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Terms() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Terms of Service \u2014 BKlein Digital Labs";
  }, []);

  return (
    <div className="frame method-frame">
      <button className="btn-back" onClick={() => navigate("/")} type="button">
        &#8592; Back
      </button>

      <h1>Terms of Service</h1>
      <p className="method-updated">Last updated: June 30, 2026</p>

      <div className="method-section">
        <h2>1. Agreement</h2>
        <p>
          By accessing or using the BKlein Digital Labs website, you agree to these terms. If you do not agree, please do not use the site.
        </p>
      </div>

      <div className="method-section">
        <h2>2. Use of the Site</h2>
        <p>
          The content on this site is provided for informational purposes.
          The tool is intended for evaluation, experimentation, and educational purposes.
          You may browse, read, and share links freely.
          You may not copy, redistribute, or commercially exploit the content without written permission.
          Users are responsible for any API usage and costs incurred through their own API keys.
          BKlein Digital Labs does not store API keys and is not responsible for charges incurred through third-party AI providers.
        </p>
      </div>

      <div className="method-section">
        <h2>3. External Links</h2>
        <p>
          This site contains links to external projects and services. We are not responsible for the content, privacy practices, or availability of third-party sites.
        </p>
      </div>

      <div className="method-section">
        <h2>4. Disclaimers</h2>
        <p>
          Information on this site is provided "as is" without warranties of any kind. Project statuses and features may change without notice.
        </p>
      </div>

      <div className="method-section">
        <h2>5. Changes to Terms</h2>
        <p>
          We may update these terms from time to time. Continued use of the site after changes constitutes acceptance of the revised terms.
        </p>
      </div>

      <div className="method-section">
        <h2>6. Contact</h2>
        <p>
          Questions about these terms can be sent to{" "}
          <a href="mailto:contact@bkleindigital.com">
            contact@bkleindigital.com
          </a>.
        </p>
      </div>

      <div className="method-section">
        <h2>7. AI-Generated Content</h2>
        <p>
          This tool uses artificial intelligence models to generate outputs.
          These outputs are provided "as is" without warranty of accuracy,
          completeness, or fitness for any purpose.
          You are responsible for reviewing and validating any output before use.
        </p>
      </div>

      <div className="method-section">
        <h2>8. Prohibited Use</h2>
        <p>
          You agree not to submit personal data, sensitive information,
          copyrighted material you do not have rights to, or illegal content
          through this tool.
        </p>
      </div>
    </div>
  );
}
