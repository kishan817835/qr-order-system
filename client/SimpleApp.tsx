import "./global.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import MenuPage from "./pages/MenuPage";

// Simple App without complex providers for now
const SimpleApp = () => {
  console.log("🚀 SimpleApp rendering...");
  
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        {/* Simple Navigation Header */}
        <div className="bg-white shadow-sm border-b p-4">
          <div className="container mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold text-orange-500">Spice Garden</h1>
            <nav className="flex space-x-4">
              <Link to="/" className="text-blue-600 hover:text-blue-800">Home</Link>
              <Link to="/menu/1" className="text-blue-600 hover:text-blue-800">Menu</Link>
              <Link to="/login" className="text-blue-600 hover:text-blue-800">Login</Link>
            </nav>
          </div>
        </div>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/menu/:restaurantId" element={<MenuPage />} />
          <Route path="*" element={
            <div className="container mx-auto p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
              <p className="text-gray-600 mb-4">The page you're looking for doesn't exist.</p>
              <Link to="/" className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
                Go Home
              </Link>
            </div>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

console.log("🚀 Starting Simple React app...");
console.log("Root element:", document.getElementById("root"));

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<SimpleApp />);
  console.log("✅ Simple app rendered successfully");
} else {
  console.error("❌ Root element not found");
}
