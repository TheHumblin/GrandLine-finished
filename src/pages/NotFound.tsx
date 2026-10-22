import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Anchor } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background">
      <div className="text-center max-w-sm px-4">
        <div className="text-8xl font-black gold-text mb-2">404</div>
        <div className="text-lg font-semibold text-foreground mb-2">Lost at Sea</div>
        <p className="text-muted-foreground mb-6">This page doesn't exist — even Nami's Log Pose can't find it.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
        >
          <Anchor size={16} />
          Return to GrandLine
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
