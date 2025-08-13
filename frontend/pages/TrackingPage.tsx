import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Package,
  MapPin,
  Phone,
  Clock,
  CheckCircle,
  Truck,
  User,
  Navigation,
  RefreshCw,
} from "lucide-react";

interface DeliveryTracking {
  orderId: string;
  trackingCode: string;
  status: "picked-up" | "on-the-way" | "delivered";
  deliveryBoy: {
    name: string;
    phone: string;
    vehicleNumber: string;
  };
  customer: {
    name: string;
    address: string;
  };
  estimatedTime: number;
  pickedUpAt?: string;
  onTheWayAt?: string;
  deliveredAt?: string;
  lastUpdated: string;
}

export default function TrackingPage() {
  const { trackingCode } = useParams();
  const [tracking, setTracking] = useState<DeliveryTracking | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    // Mock tracking data - in real app, this would come from API
    const mockTracking: DeliveryTracking = {
      orderId: "#1236",
      trackingCode: trackingCode || "TRK1234567890",
      status: "on-the-way",
      deliveryBoy: {
        name: "Raj Kumar",
        phone: "+91 98765 11111",
        vehicleNumber: "DL-01-AB-1234",
      },
      customer: {
        name: "Priya Singh",
        address: "123 Main Street, Sector 15, New Delhi - 110001",
      },
      estimatedTime: 15,
      pickedUpAt: new Date(Date.now() - 600000).toISOString(), // 10 min ago
      onTheWayAt: new Date(Date.now() - 300000).toISOString(), // 5 min ago
      lastUpdated: new Date().toISOString(),
    };

    setTimeout(() => {
      setTracking(mockTracking);
      setLoading(false);
    }, 1000);
  }, [trackingCode]);

  const refreshTracking = () => {
    setLastRefresh(new Date());
    // In real app, would refetch from API
    console.log("Refreshing tracking data...");
  };

  const getStatusSteps = () => {
    if (!tracking) return [];

    return [
      {
        id: "picked-up",
        title: "Order Picked Up",
        description: `Picked up by ${tracking.deliveryBoy.name}`,
        icon: Package,
        completed: true,
        timestamp: tracking.pickedUpAt,
      },
      {
        id: "on-the-way",
        title: "On the Way",
        description: "Delivery in progress",
        icon: Truck,
        completed:
          tracking.status === "on-the-way" || tracking.status === "delivered",
        timestamp: tracking.onTheWayAt,
      },
      {
        id: "delivered",
        title: "Delivered",
        description: "Order completed",
        icon: CheckCircle,
        completed: tracking.status === "delivered",
        timestamp: tracking.deliveredAt,
      },
    ];
  };

  const formatTime = (timestamp?: string) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeAgo = (timestamp: string) => {
    const diffMs = new Date().getTime() - new Date(timestamp).getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;

    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours}h ${diffMins % 60}m ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-orange border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-secondary">Loading tracking information...</p>
        </div>
      </div>
    );
  }

  if (!tracking) {
    return (
      <div className="min-h-screen bg-gray flex items-center justify-center">
        <div className="text-center">
          <Package className="w-12 h-12 text-secondary mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-primary mb-2">
            Tracking Not Found
          </h2>
          <p className="text-secondary">
            Invalid tracking code: {trackingCode}
          </p>
        </div>
      </div>
    );
  }

  const statusSteps = getStatusSteps();

  return (
    <div className="min-h-screen bg-gray">
      {/* Header */}
      <div className="bg-white shadow border-b">
        <div className="container py-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-orange rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-primary mb-2">
              Track Your Order
            </h1>
            <p className="text-secondary">
              Order {tracking.orderId} • {tracking.trackingCode}
            </p>
          </div>
        </div>
      </div>

      <div className="container py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Current Status */}
          <div className="card text-center">
            <div className="w-12 h-12 bg-orange rounded-full flex items-center justify-center mx-auto mb-4">
              {tracking.status === "picked-up" && (
                <Package className="w-6 h-6 text-white" />
              )}
              {tracking.status === "on-the-way" && (
                <Truck className="w-6 h-6 text-white" />
              )}
              {tracking.status === "delivered" && (
                <CheckCircle className="w-6 h-6 text-white" />
              )}
            </div>

            <h2 className="text-xl font-semibold text-primary mb-2">
              {tracking.status === "picked-up" && "Order Picked Up"}
              {tracking.status === "on-the-way" && "On the Way"}
              {tracking.status === "delivered" && "Delivered"}
            </h2>

            <p className="text-secondary mb-4">
              {tracking.status === "picked-up" &&
                "Your order has been picked up and will be on the way soon."}
              {tracking.status === "on-the-way" &&
                `Estimated delivery in ${tracking.estimatedTime} minutes.`}
              {tracking.status === "delivered" &&
                "Your order has been successfully delivered!"}
            </p>

            <div className="flex items-center justify-center space-x-4 text-sm text-secondary">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Updated {getTimeAgo(tracking.lastUpdated)}</span>
              </div>
              <button
                onClick={refreshTracking}
                className="flex items-center space-x-1 text-orange hover:text-orange-dark"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Progress Timeline */}
          <div className="card">
            <h3 className="text-lg font-semibold text-primary mb-6">
              Delivery Progress
            </h3>

            <div className="space-y-4">
              {statusSteps.map((step, index) => {
                const Icon = step.icon;
                const isLast = index === statusSteps.length - 1;

                return (
                  <div key={step.id} className="flex items-start space-x-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          step.completed
                            ? "bg-green text-white"
                            : "bg-muted text-secondary"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      {!isLast && (
                        <div
                          className={`w-0.5 h-8 mt-2 ${
                            step.completed ? "bg-green" : "bg-muted"
                          }`}
                        />
                      )}
                    </div>

                    <div className="flex-1 pb-8">
                      <div className="flex items-center justify-between">
                        <h4
                          className={`font-medium ${
                            step.completed ? "text-primary" : "text-secondary"
                          }`}
                        >
                          {step.title}
                        </h4>
                        {step.timestamp && (
                          <span className="text-sm text-secondary">
                            {formatTime(step.timestamp)}
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-sm ${
                          step.completed ? "text-secondary" : "text-muted"
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Boy Info */}
          <div className="card">
            <h3 className="text-lg font-semibold text-primary mb-4">
              Delivery Partner
            </h3>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>

              <div className="flex-1">
                <h4 className="font-medium text-primary">
                  {tracking.deliveryBoy.name}
                </h4>
                <p className="text-sm text-secondary">
                  Vehicle: {tracking.deliveryBoy.vehicleNumber}
                </p>
              </div>

              <a
                href={`tel:${tracking.deliveryBoy.phone}`}
                className="btn btn-primary btn-sm"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call
              </a>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="card">
            <h3 className="text-lg font-semibold text-primary mb-4">
              Delivery Address
            </h3>

            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-secondary mt-1" />
              <div>
                <p className="font-medium text-primary">
                  {tracking.customer.name}
                </p>
                <p className="text-secondary">{tracking.customer.address}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <a
              href={`tel:${tracking.deliveryBoy.phone}`}
              className="btn btn-secondary"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call Delivery Boy
            </a>
            <button onClick={refreshTracking} className="btn btn-secondary">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Status
            </button>
          </div>

          {/* Last Updated */}
          <div className="text-center text-sm text-secondary">
            Last updated: {new Date(tracking.lastUpdated).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
