import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    // Prevent multiple redirects
    if (!redirected) {
      setRedirected(true);
      // Use replace instead of navigate to avoid back button issues
      navigate("/menu/1", { replace: true });
    }
  }, [navigate, redirected]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading restaurant menu...</p>
      </div>
    </div>
  );
}
