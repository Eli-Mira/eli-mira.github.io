import { Component } from 'react';

export default class LabErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed ? <div className="lab-load-error" role="alert"><p>The local interface could not load. The rest of the portfolio is still available.</p><button type="button" className="action secondary" onClick={() => window.location.reload()}>Reload preview</button></div> : this.props.children;
  }
}
