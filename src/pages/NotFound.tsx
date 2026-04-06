import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";

const NotFound = () => {
  usePageTitle("Page Not Found");
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="font-display text-7xl font-bold gradient-text mb-4">404</div>
        <h1 className="font-display text-xl font-semibold text-foreground mb-3">Page Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button variant="hero" asChild>
          <Link to="/"><ArrowLeft size={16} /> Back to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
