import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="frame method-frame">
          <h1>Something went wrong</h1>
          <p>
            An unexpected error occurred. Please reload the page to continue.
          </p>
          <button
            className="btn-primary"
            onClick={this.handleReload}
            type="button"
            style={{ marginTop: "16px" }}
          >
            Reload page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
