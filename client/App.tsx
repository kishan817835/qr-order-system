import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RestaurantProvider } from "@/context/RestaurantContext";

// Import pages
import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import PaymentPage from "./pages/PaymentPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Orders from "./pages/admin/Orders";
import Categories from "./pages/admin/Categories";
import Items from "./pages/admin/Items";
import Charges from "./pages/admin/Charges";
import Settings from "./pages/admin/Settings";
import DeliveryManagement from "./pages/admin/DeliveryManagement";
import StaffManagement from "./pages/admin/StaffManagement";
import TableManagement from "./pages/admin/TableManagement";
import KitchenDashboard from "./pages/KitchenDashboard";
import DeliveryDashboard from "./pages/DeliveryDashboard";
import DeliveryDetailsPage from "./pages/DeliveryDetailsPage";
import TrackingPage from "./pages/TrackingPage";
import GeneralStaffDashboard from "./pages/GeneralStaffDashboard";
import LoginPage from "./pages/LoginPage";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import APITestPage from "./pages/APITestPage";

// Super Admin imports
import SuperAdminLayout from "./pages/super-admin/SuperAdminLayout";
import SuperAdminDashboard from "./pages/super-admin/SuperAdminDashboard";
import AdminsManagement from "./pages/super-admin/AdminsManagement";
import CreateAdmin from "./pages/super-admin/CreateAdmin";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  console.log("🚀 Main App component rendering...");

  try {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <RestaurantProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/menu/:restaurantId" element={<MenuPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route
                  path="/order/confirmation"
                  element={<OrderConfirmationPage />}
                />
                <Route
                  path="/order-confirmation"
                  element={<OrderConfirmationPage />}
                />
                <Route
                  path="/track-order/:orderId"
                  element={<OrderTrackingPage />}
                />
                <Route path="/track-order" element={<OrderTrackingPage />} />
                <Route path="/api-test" element={<APITestPage />} />
                <Route path="/kitchen" element={<KitchenDashboard />} />
                <Route
                  path="/KitchenDashboard"
                  element={<KitchenDashboard />}
                />
                <Route path="/delivery" element={<DeliveryDashboard />} />
                <Route
                  path="/DeliveryDashboard"
                  element={<DeliveryDashboard />}
                />
                <Route
                  path="/delivery-details/:orderId"
                  element={<DeliveryDetailsPage />}
                />
                <Route
                  path="/delivery-details"
                  element={<DeliveryDashboard />}
                />
                <Route
                  path="/DeliveryDetailsPage"
                  element={<DeliveryDetailsPage />}
                />
                <Route path="/track/:trackingCode" element={<TrackingPage />} />
                <Route path="/staff" element={<GeneralStaffDashboard />} />
                <Route
                  path="/GeneralStaffDashboard"
                  element={<GeneralStaffDashboard />}
                />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/LoginPage" element={<LoginPage />} />

                {/* Super Admin Routes */}
                <Route path="/super-admin" element={<SuperAdminLayout />}>
                  <Route index element={<SuperAdminDashboard />} />
                  <Route path="admins" element={<AdminsManagement />} />
                  <Route path="create-admin" element={<CreateAdmin />} />
                  <Route
                    path="restaurants"
                    element={
                      <div className="p-8 text-center">
                        <h2 className="text-xl font-bold mb-4">
                          Restaurants Management
                        </h2>
                        <p className="text-gray-600">Coming Soon...</p>
                      </div>
                    }
                  />
                  <Route
                    path="analytics"
                    element={
                      <div className="p-8 text-center">
                        <h2 className="text-xl font-bold mb-4">
                          Platform Analytics
                        </h2>
                        <p className="text-gray-600">Coming Soon...</p>
                      </div>
                    }
                  />
                  <Route
                    path="settings"
                    element={
                      <div className="p-8 text-center">
                        <h2 className="text-xl font-bold mb-4">
                          Platform Settings
                        </h2>
                        <p className="text-gray-600">Coming Soon...</p>
                      </div>
                    }
                  />
                </Route>

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="Dashboard" element={<Dashboard />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="categories" element={<Categories />} />
                  <Route path="items" element={<Items />} />
                  <Route path="tables" element={<TableManagement />} />
                  <Route path="charges" element={<Charges />} />
                  <Route
                    path="delivery-management"
                    element={<DeliveryManagement />}
                  />
                  <Route path="staff" element={<StaffManagement />} />
                  <Route path="settings" element={<Settings />} />
                </Route>

                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </RestaurantProvider>
        </TooltipProvider>
      </QueryClientProvider>
    );
  } catch (error) {
    console.error("❌ App rendering error:", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Application Error
          </h1>
          <p className="text-red-500 mb-4">
            Something went wrong loading the application.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }
};

console.log("🚀 Starting Restaurant Management App...");
console.log("Root element:", document.getElementById("root"));

const rootElement = document.getElementById("root");
if (rootElement) {
  try {
    createRoot(rootElement).render(<App />);
    console.log("✅ App rendered successfully");
  } catch (error) {
    console.error("❌ Error rendering app:", error);
    rootElement.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #fee2e2;">
        <div style="text-align: center; padding: 2rem;">
          <h1 style="color: #dc2626; margin-bottom: 1rem;">Failed to Load Application</h1>
          <p style="color: #7f1d1d; margin-bottom: 1rem;">Please refresh the page or contact support.</p>
          <button onclick="window.location.reload()" style="background: #dc2626; color: white; padding: 0.5rem 1rem; border: none; border-radius: 0.375rem; cursor: pointer;">
            Reload Page
          </button>
        </div>
      </div>
    `;
  }
} else {
  console.error("❌ Root element not found");
  document.body.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #fee2e2;">
      <div style="text-align: center; padding: 2rem;">
        <h1 style="color: #dc2626;">Root Element Missing</h1>
        <p style="color: #7f1d1d;">The application container is not found.</p>
      </div>
    </div>
  `;
}
