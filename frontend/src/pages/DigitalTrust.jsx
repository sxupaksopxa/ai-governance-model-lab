import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/common.css";

export default function DigitalTrust() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [profileError, setProfileError] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showJson, setShowJson] = useState(false);

  useEffect(() => {
    document.title = "Digital Trust — BKlein Digital Labs";
  }, []);

  useEffect(() => {
    fetch("/.well-known/digital-trust.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Profile not found");
        }
        return response.json();
      })
      .then((data) => {
        setProfile(data);
        setProfileError(false);
      })
      .catch(() => {
        setProfile(null);
        setProfileError(true);
      });
  }, []);

  const service = profile?.service || {};
  const ai = profile?.artificial_intelligence || {};
  const privacy = profile?.privacy || {};
  const profileInfo = profile?.profile || {};
  const verification = profile?.verification || {};
  const governance = profile?.governance || {};

  return (
    <div className="frame method-frame">
      <button className="btn-back" onClick={() => navigate("/")} type="button">
        &#8592; Back
      </button>

      <h1>Digital Trust Profile</h1>

      <p className="method-section">
        This Digital Trust Profile provides structured transparency information about this digital service. It is intended primarily for AI agents, enterprise systems, developers, auditors, and advanced users.
      </p>

      <section className="method-section">
        <h2>Overview</h2>
        <p><strong>Service:</strong> {service.name || "AI Governance Model Lab"}</p>
        <p><strong>Provider:</strong> {service.owner || "BKlein Digital Labs"}</p>
        <p><strong>Uses Artificial Intelligence:</strong> yes</p>
        <p><strong>Human Oversight:</strong> required</p>
        <p><strong>Automated Decisions:</strong> no</p>
        <p><strong>Profile Status:</strong> {profileInfo.status || "unpublished"}</p>
        <p><strong>Verification:</strong> {verification.status || "not verified"}</p>
        <p>
          <strong>Profile Endpoint:</strong>{" "}
          <code>/.well-known/digital-trust.json</code>
        </p>

        {profileError && (
          <p>
            <strong>Note:</strong> Machine-readable profile was not found.
          </p>
        )}
      </section>

      <section className="method-section profile-actions">
        <button
          className="btn-back"
          type="button"
          onClick={() => setShowDetails((value) => !value)}
        >
          {showDetails ? "Hide Full Profile" : "View Full Profile"}
        </button>

        <button
          className="btn-back"
          type="button"
          onClick={() => setShowJson((value) => !value)}
        >
          {showJson ? "Hide JSON" : "View JSON"}
        </button>
      </section>

      {showDetails && (
        <>
          <section className="method-section">
            <h2>1. Service Identity</h2>
            <p><strong>Service Name:</strong> {service.name || "AI Governance Model Lab"}</p>
            <p><strong>Provider:</strong> {service.provider || "BKlein Digital Labs"}</p>
            <p><strong>Purpose:</strong> {service.purpose || "Governance-focused AI classification and semantic retrieval"}</p>
            <p><strong>Website:</strong> {service.website || "N/A"}</p>
            <p><strong>Domain:</strong> {service.domain || "N/A"}</p>            
          </section>

          <section className="method-section">
            <h2>2. Artificial Intelligence</h2>
            <p><strong>AI Used:</strong> {ai.ai_used === false ? "no" : "yes"}</p>
            <p><strong>Primary Purpose:</strong> {ai.primary_purpose || "N/A"}</p>
            <p>
              <strong>Supporting Capabilities:</strong>{" "}
              {ai.ai_capabilities
              ? ai.ai_capabilities
              .map(capability =>
                capability
              .replace(/_/g, " ")
              .replace(/\b\w/g, c => c.toUpperCase())
              )
                .join(", ")
              : "N/A"}
            </p>
 
            <p><strong>Human Oversight:</strong> {ai.human_oversight === false ? "No" : "required"}</p>
            <p><strong>Explainability:</strong> {ai.explainability === false ? "No" : "supported"}</p>
          </section>


          <section className="method-section">
            <h2>3. Governance</h2>
            <p><strong>Decision Support:</strong> {governance.decision_support === false ? "No" : "supported"}</p>
            <p><strong>Automated Decisions:</strong> {governance.automated_decisions === false ? "not performed" : "supported"}</p>
            <p><strong>Methodology Published:</strong> {governance.methodology_published === false ? "No" : "supported"}</p>                        
          </section>


          <section className="method-section">
            <h2>6. Verification</h2>
            <p><strong>Verification:</strong> {verification.status || "N/A"}</p>
          </section>

          <section className="method-section">
            <h2>7. Privacy</h2>
            <p><strong>Privacy Policy Available:</strong> {privacy.privacy_policy_available === false ? "no" : "yes"}</p>
          </section>
        </>
      )}

      {showJson && (
        <section className="method-section">
          <h2>Machine-readable Profile</h2>
          <p>
            The same information is published as a machine-readable JSON profile
            for future browser extensions, verification tools, and digital trust
            services.
          </p>

          <pre className="json-preview">
            {JSON.stringify(profile || { status: "unpublished" }, null, 2)}
          </pre>
        </section>
      )}
    </div>
  );
}
