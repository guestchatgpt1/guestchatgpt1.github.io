import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center px-4 bg-background text-foreground">
          <div className="text-center max-w-md">
            <div className="font-display text-5xl font-bold gradient-text mb-4">Oops</div>
            <h1 className="font-display text-lg font-semibold mb-3">Something went wrong</h1>
            <p className="text-muted-foreground text-sm mb-8">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <Button
              variant="hero"
              onClick={() => {
                this.setState({ hasError: false });
                window.location.href = "/";
              }}
            >
              Reload App
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
