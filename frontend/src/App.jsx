import { Routes, Route, Link } from "react-router-dom";
import "./styles/App.css";
import "./styles/common.css";

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Methodology from "./pages/Methodology.jsx";
import DigitalTrust from "./pages/DigitalTrust.jsx";
import Privacy from "./pages/Privacy.jsx";
import Terms from "./pages/Terms.jsx";

function NotFound() {
  return (
    <div className="frame method-frame">
      <h1>Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" className="btn-primary" style={{ marginTop: "16px", textDecoration: "none" }}>
        Go home
      </Link>
    </div>
  );
}

export default function App() {
  return (
    <div className="app">
      <Header />

      <main className="container">
        <ScrollToTop />
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/methodology" element={<Methodology />} />
            <Route path="/about" element={<About />} />
            <Route path="/digital-trust" element={<DigitalTrust />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </main>

      <Footer />
    </div>
  );
}
