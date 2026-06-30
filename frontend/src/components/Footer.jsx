import { Link, useLocation } from "react-router-dom";

export default function Footer() {
  const location = useLocation();

  const navItems = [
    { key: "/privacy", label: "Privacy" },
    { key: "/terms", label: "Terms" },
  ];

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-left">
          <strong>BKlein Digital Labs</strong>
          <span>Building practical AI solutions for a digital world.</span>
        </div>

        <div className="footer-right">
          {navItems.map((item) => (
            <Link
              key={item.key}
              to={item.key}
              className={`footer-link ${location.pathname === item.key ? "active" : ""}`}
            >
              {item.label}
            </Link>
          ))}

          <span className="footer-separator">|</span>

          <span className="footer-copy">
            &copy; 2026 BKlein Digital Labs. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
