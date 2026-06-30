import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();

  const navItems = [
    { key: "/", label: "Home" },
    { key: "/methodology", label: "Methodology" },
    { key: "/about", label: "About" },
    { key: "/digital-trust", label: "Digital Trust" },
  ];

  return (
    <header className="top-nav">
      <div className="top-nav-inner">
        <div className="top-nav-brand">
          <img
            src="/logo.png"
            alt="BKlein Digital Labs"
            className="top-nav-logo"
          />
          <span className="top-nav-title">
            BKlein Digital Labs
          </span>
        </div>

        <nav className="top-nav-menu">
          {navItems.map((item) => (
            <Link
              key={item.key}
              to={item.key}
              className={`top-nav-item ${location.pathname === item.key ? "active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
