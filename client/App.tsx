import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RestaurantProvider } from "@/context/RestaurantContext";
import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import PaymentPage from "./pages/PaymentPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Orders from "./pages/admin/Orders";
import Categories from "./pages/admin/Categories";
import Items from "./pages/admin/Items";
import Charges from "./pages/admin/Charges";
import Settings from "./pages/admin/Settings";
import DeliveryManagement from "./pages/admin/DeliveryManagement";
import StaffManagement from "./pages/admin/StaffManagement";
import KitchenDashboard from "./pages/KitchenDashboard";
import DeliveryDashboard from "./pages/DeliveryDashboard";
import GeneralStaffDashboard from "./pages/GeneralStaffDashboard";
import LoginPage from "./pages/LoginPage";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
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
            <Route path="/order/confirmation" element={<OrderConfirmationPage />} />
            <Route path="/kitchen" element={<KitchenDashboard />} />
            <Route path="/KitchenDashboard" element={<KitchenDashboard />} />
            <Route path="/delivery" element={<DeliveryDashboard />} />
            <Route path="/DeliveryDashboard" element={<DeliveryDashboard />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="Dashboard" element={<Dashboard />} />
              <Route path="orders" element={<Orders />} />
              <Route path="categories" element={<Categories />} />
              <Route path="items" element={<Items />} />
              <Route path="charges" element={<Charges />} />
              <Route path="delivery-management" element={<DeliveryManagement />} />
              <Route path="staff" element={<StaffManagement />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </RestaurantProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
