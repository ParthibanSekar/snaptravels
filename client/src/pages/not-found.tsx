import { Button } from "@/components/ui/button";
import { AlertCircle, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="text-center">
        <div className="w-32 h-32 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-8 glow-purple">
          <AlertCircle className="w-16 h-16 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">404 - Page Not Found</h1>
        <p className="text-white/60 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button 
          onClick={() => window.location.href = '/'}
          className="modern-button hover-lift"
        >
          <Home className="w-5 h-5 mr-2" />
          Go Home
        </Button>
      </div>
    </div>
  );
}
