import { Component } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Keep the stack in the console so the failure is still debuggable in dev.
    console.error('Unhandled UI error', error, info);
  }

  handleReset = () => {
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-card">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-red-50 p-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-gray-900">Something went wrong</h1>
              <p className="mt-1 text-sm text-gray-500">
                This screen could not be displayed. Your saved data has not been changed.
              </p>
              <pre className="mt-4 max-h-40 overflow-auto rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
                {error.message || String(error)}
              </pre>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={this.handleReset}
                  className="inline-flex items-center gap-2 rounded-lg border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
                >
                  <RotateCcw className="h-4 w-4" />
                  Try again
                </button>
                <button
                  onClick={() => window.location.assign('/')}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Back to dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
