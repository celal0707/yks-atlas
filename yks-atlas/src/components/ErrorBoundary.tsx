import { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error('Error caught by boundary:', error);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 bg-dark-bg flex items-center justify-center">
          <div className="max-w-md w-full mx-4 bg-dark-card border border-dark-border rounded-lg p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-accent-red/20 flex items-center justify-center">
                <AlertTriangle size={24} className="text-accent-red" />
              </div>
            </div>
            <h1 className="text-xl font-semibold text-text-primary mb-2">Bir Hata Oluştu</h1>
            <p className="text-sm text-text-secondary mb-6">
              {this.state.error?.message || 'Bilinmeyen bir hata oluştu'}
            </p>
            <button
              onClick={this.handleReset}
              className="w-full bg-primary-600 hover:bg-primary-500 text-white rounded-lg px-4 py-2.5 font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <RefreshCw size={16} />
              Sayfayı Yenile
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
