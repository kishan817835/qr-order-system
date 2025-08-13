import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RestaurantProvider } from "@/context/RestaurantContext";

// Regular pages
import Index from "@/pages/Index";
import MenuPage from "@/pages/MenuPage";
import CartPage from "@/pages/CartPage";
import PaymentPage from "@/pages/PaymentPage";
import OrderConfirmationPage from "@/pages/OrderConfirmationPage";
import OrderTrackingPage from "@/pages/OrderTrackingPage";
import TrackingPage from "@/pages/TrackingPage";
import LoginPage from "@/pages/LoginPage";
import NotFound from "@/pages/NotFound";

// Admin pages
import AdminLayout from "@/pages/admin/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import Orders from "@/pages/admin/Orders";
import TableManagement from "@/pages/admin/TableManagement";
import Items from "@/pages/admin/Items";
import Categories from "@/pages/admin/Categories";
import Charges from "@/pages/admin/Charges";
import StaffManagement from "@/pages/admin/StaffManagement";
import Settings from "@/pages/admin/Settings";
import DeliveryManagement from "@/pages/admin/DeliveryManagement";

// Kitchen and delivery dashboards
import KitchenDashboard from "@/pages/KitchenDashboard";
import DeliveryDashboard from "@/pages/DeliveryDashboard";
import DeliveryDetailsPage from "@/pages/DeliveryDetailsPage";
import GeneralStaffDashboard from "@/pages/GeneralStaffDashboard";

// Super Admin pages
import SuperAdminLayout from "@/pages/super-admin/SuperAdminLayout";
import SuperAdminDashboard from "@/pages/super-admin/SuperAdminDashboard";
import AdminsManagement from "@/pages/super-admin/AdminsManagement";
import CreateAdmin from "@/pages/super-admin/CreateAdmin";

import "./global.css";

export default function App() {
  return (
    <RestaurantProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/menu/:restaurantId" element={<MenuPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route
            path="/order-confirmation"
            element={<OrderConfirmationPage />}
          />
          <Route path="/track-order/:orderId" element={<OrderTrackingPage />} />
          <Route path="/track-order" element={<OrderTrackingPage />} />
          <Route path="/tracking" element={<TrackingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Kitchen and delivery dashboards */}
          <Route path="/kitchen" element={<KitchenDashboard />} />
          <Route path="/delivery" element={<DeliveryDashboard />} />
          <Route path="/delivery/:orderId" element={<DeliveryDetailsPage />} />
          <Route path="/staff" element={<GeneralStaffDashboard />} />

          {/* Super Admin routes */}
          <Route path="/super-admin" element={<SuperAdminLayout />}>
            <Route index element={<SuperAdminDashboard />} />
            <Route path="admins" element={<AdminsManagement />} />
            <Route path="create-admin" element={<CreateAdmin />} />
            <Route
              path="restaurants"
              element={<div>Restaurants page - Coming soon</div>}
            />
            <Route
              path="analytics"
              element={<div>Analytics page - Coming soon</div>}
            />
            <Route
              path="settings"
              element={<div>Settings page - Coming soon</div>}
            />
          </Route>

          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="tables" element={<TableManagement />} />
            <Route path="items" element={<Items />} />
            <Route path="categories" element={<Categories />} />
            <Route path="charges" element={<Charges />} />
            <Route path="staff" element={<StaffManagement />} />
            <Route path="delivery" element={<DeliveryManagement />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Catch all route - must be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </RestaurantProvider>
  );
}
