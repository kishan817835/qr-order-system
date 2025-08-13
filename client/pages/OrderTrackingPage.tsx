import { useState, useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import {
  Clock,
  CheckCircle,
  Package,
  Truck,
  MapPin,
  Phone,
  RefreshCw,
  ArrowLeft,
  Utensils,
} from "lucide-react";

interface Order {
  _id: string;
  order_number: string;
  status: string;
  service_type: string;
  table_number?: number;
  customer_name?: string;
  customer_phone?: string;
  delivery_address?: {
    street: string;
    city: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total_amount: number;
  estimated_time: number;
  createdAt: string;
  restaurant_id: {
    name: string;
    address: string;
    phone: string;
  };
}

const statusSteps = {
  dining: [
    { key: "pending", label: "Order Placed", icon: CheckCircle },
    { key: "confirmed", label: "Confirmed", icon: CheckCircle },
    { key: "preparing", label: "Preparing", icon: Utensils },
    { key: "ready", label: "Ready to Serve", icon: CheckCircle },
    { key: "completed", label: "Served", icon: CheckCircle },
  ],
  takeaway: [
    { key: "pending", label: "Order Placed", icon: CheckCircle },
    { key: "confirmed", label: "Confirmed", icon: CheckCircle },
    { key: "preparing", label: "Preparing", icon: Utensils },
    { key: "ready", label: "Ready for Pickup", icon: Package },
    { key: "completed", label: "Picked Up", icon: CheckCircle },
  ],
  delivery: [
    { key: "pending", label: "Order Placed", icon: CheckCircle },
    { key: "confirmed", label: "Confirmed", icon: CheckCircle },
    { key: "preparing", label: "Preparing", icon: Utensils },
    { key: "ready", label: "Ready", icon: Package },
    { key: "out_for_delivery", label: "Out for Delivery", icon: Truck },
    { key: "completed", label: "Delivered", icon: CheckCircle },
  ],
};

export default function OrderTrackingPage() {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock order data for demonstration
  const mockOrder: Order = {
    _id: orderId || "mock-id",
    order_number: orderNumber || "ORD123456",
    status: "preparing",
    service_type: "dining",
    table_number: 5,
    customer_name: "John Doe",
    customer_phone: "+91 98765 43210",
    items: [
      { name: "Butter Chicken", quantity: 2, price: 380 },
      { name: "Naan", quantity: 4, price: 60 },
      { name: "Basmati Rice", quantity: 1, price: 120 },
    ],
    total_amount: 1000,
    estimated_time: 25,
    createdAt: new Date().toISOString(),
    restaurant_id: {
      name: "Spice Garden",
      address: "123 Main Street, Food District",
      phone: "+91 12345 67890",
    },
  };

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    const timer = setTimeout(() => {
      setOrder(mockOrder);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [orderId, orderNumber]);

  const getCurrentStepIndex = (status: string, serviceType: string) => {
    const steps =
      statusSteps[serviceType as keyof typeof statusSteps] ||
      statusSteps.dining;
    return steps.findIndex((step) => step.key === status);
  };

  const getEstimatedTime = () => {
    if (!order) return "";

    const orderTime = new Date(order.createdAt);
    const estimatedDelivery = new Date(
      orderTime.getTime() + order.estimated_time * 60000,
    );
    const now = new Date();

    if (estimatedDelivery > now) {
      const diffMinutes = Math.ceil(
        (estimatedDelivery.getTime() - now.getTime()) / 60000,
      );
      return `${diffMinutes} minutes`;
    }

    return "Expected soon";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600";
      case "confirmed":
      case "preparing":
        return "text-orange-600";
      case "ready":
      case "out_for_delivery":
        return "text-blue-600";
      case "completed":
        return "text-green-600";
      case "cancelled":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-orange mx-auto mb-4 animate-spin" />
          <p className="text-secondary">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Order Not Found
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const steps =
    statusSteps[order.service_type as keyof typeof statusSteps] ||
    statusSteps.dining;
  const currentStepIndex = getCurrentStepIndex(
    order.status,
    order.service_type,
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="text-orange">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold text-primary">Track Order</h1>
          <button
            onClick={() => window.location.reload()}
            className="text-orange"
          >
            <RefreshCw className="w-6 h-6" />
          </button>
        </div>

        {/* Order Header */}
        <div className="card mb-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-primary mb-2">
              Order {order.order_number}
            </h2>
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)} bg-opacity-10`}
            >
              <div
                className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(order.status).replace("text-", "bg-")}`}
              ></div>
              {order.status
                .replace("_", " ")
                .replace(/\b\w/g, (l) => l.toUpperCase())}
            </div>
            <div className="flex items-center justify-center text-orange mt-3">
              <Clock className="w-4 h-4 mr-2" />
              <span className="text-sm">ETA: {getEstimatedTime()}</span>
            </div>
          </div>
        </div>

        {/* Service Type Info */}
        <div className="card mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange rounded-full flex items-center justify-center">
              {order.service_type === "dining"
                ? "🍽️"
                : order.service_type === "takeaway"
                  ? "🥡"
                  : "🚚"}
            </div>
            <div>
              <p className="font-medium text-primary capitalize">
                {order.service_type}
                {order.table_number && ` - Table ${order.table_number}`}
              </p>
              <p className="text-sm text-secondary">
                {order.service_type === "dining" && "Dine-in service"}
                {order.service_type === "takeaway" && "Ready for pickup"}
                {order.service_type === "delivery" && "Home delivery"}
              </p>
            </div>
          </div>

          {/* Customer Details */}
          {(order.customer_name || order.customer_phone) && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              {order.customer_name && (
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-secondary">Customer:</span>
                  <span className="text-primary font-medium">
                    {order.customer_name}
                  </span>
                </div>
              )}
              {order.customer_phone && (
                <div className="flex justify-between text-sm">
                  <span className="text-secondary">Phone:</span>
                  <span className="text-primary">{order.customer_phone}</span>
                </div>
              )}
            </div>
          )}

          {/* Delivery Address */}
          {order.delivery_address && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-secondary mt-0.5" />
                <div>
                  <p className="text-sm text-secondary">Delivery Address:</p>
                  <p className="text-sm text-primary">
                    {order.delivery_address.street},{" "}
                    {order.delivery_address.city}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Order Progress */}
        <div className="card mb-6">
          <h3 className="font-semibold text-primary mb-4">Order Progress</h3>
          <div className="space-y-4">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <div key={step.key} className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isCompleted
                        ? "bg-green text-white"
                        : isCurrent
                          ? "bg-orange text-white"
                          : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    <StepIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p
                      className={`font-medium ${
                        isCompleted
                          ? "text-green"
                          : isCurrent
                            ? "text-orange"
                            : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </p>
                    {isCurrent && (
                      <p className="text-sm text-orange">In progress...</p>
                    )}
                  </div>
                  {isCompleted && (
                    <CheckCircle className="w-4 h-4 text-green" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Items */}
        <div className="card mb-6">
          <h3 className="font-semibold text-primary mb-3">Order Items</h3>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-primary">{item.name}</p>
                  <p className="text-sm text-secondary">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium text-primary">
                  ₹{item.price * item.quantity}
                </p>
              </div>
            ))}
            <div className="pt-3 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <p className="font-bold text-primary">Total Amount</p>
                <p className="font-bold text-primary text-lg">
                  ₹{order.total_amount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Restaurant Info */}
        <div className="card mb-6">
          <h3 className="font-semibold text-primary mb-3">
            Restaurant Details
          </h3>
          <div className="space-y-2">
            <p className="font-medium text-primary">
              {order.restaurant_id.name}
            </p>
            <p className="text-sm text-secondary">
              {order.restaurant_id.address}
            </p>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-secondary" />
              <a
                href={`tel:${order.restaurant_id.phone}`}
                className="text-sm text-orange font-medium"
              >
                {order.restaurant_id.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary w-full"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Status
          </button>

          {order.restaurant_id.phone && (
            <a
              href={`tel:${order.restaurant_id.phone}`}
              className="btn btn-secondary w-full text-center"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call Restaurant
            </a>
          )}

          <Link to={`/menu/1`} className="btn btn-secondary w-full text-center">
            Order Again
          </Link>
        </div>
      </div>
    </div>
  );
}
