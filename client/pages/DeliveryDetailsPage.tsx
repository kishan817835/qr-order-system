import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Package, 
  Clock, 
  Navigation, 
  CheckCircle,
  QrCode,
  ArrowLeft,
  User,
  CreditCard,
  AlertCircle,
  Camera
} from 'lucide-react';
import QRCodeGenerator from '../components/QRCodeGenerator';

interface DeliveryOrder {
  id: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  total: number;
  paymentMethod: 'cod' | 'paid-online';
  status: 'picked-up' | 'on-the-way' | 'delivered';
  pickedUpAt: string;
  estimatedTime: number;
  distance: string;
  deliveryBoy: {
    name: string;
    phone: string;
    vehicleNumber: string;
  };
  trackingCode: string;
}

export default function DeliveryDetailsPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  // Redirect to delivery dashboard if no orderId
  useEffect(() => {
    if (!orderId || orderId.trim() === '') {
      navigate('/delivery');
      return;
    }
  }, [orderId, navigate]);
  const [order, setOrder] = useState<DeliveryOrder | null>(null);
  const [currentStatus, setCurrentStatus] = useState<'picked-up' | 'on-the-way' | 'delivered'>('picked-up');
  const [showQRModal, setShowQRModal] = useState(false);
  const [customerNotified, setCustomerNotified] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);

  // Mock order data - in real app, this would come from API
  useEffect(() => {
    if (!orderId || orderId.trim() === '') {
      return; // Early return, useEffect above will handle redirect
    }

    const mockOrder: DeliveryOrder = {
      id: orderId,
      items: [
        { name: 'Biryani Special', quantity: 1, price: 450 },
        { name: 'Raita', quantity: 1, price: 80 },
        { name: 'Gulab Jamun', quantity: 2, price: 150 }
      ],
      customer: {
        name: 'Priya Singh',
        email: 'priya.singh@email.com',
        phone: '+91 98765 43210',
        address: '123 Main Street, Sector 15, New Delhi - 110001',
        coordinates: {
          lat: 28.5355,
          lng: 77.3910
        }
      },
      total: 880,
      paymentMethod: 'cod',
      status: 'picked-up',
      pickedUpAt: new Date().toISOString(),
      estimatedTime: 25,
      distance: '2.5 km',
      deliveryBoy: {
        name: 'Raj Kumar',
        phone: '+91 98765 11111',
        vehicleNumber: 'DL-01-AB-1234'
      },
      trackingCode: `TRK${Date.now()}`
    };

    setOrder(mockOrder);
    setCurrentStatus(mockOrder.status);
  }, [orderId]);

  // Get current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to restaurant location
          setCurrentLocation({
            lat: 28.5355,
            lng: 77.3910
          });
        }
      );
    }
  }, []);

  const updateDeliveryStatus = (newStatus: 'on-the-way' | 'delivered') => {
    if (!order) return;

    setCurrentStatus(newStatus);
    setOrder({...order, status: newStatus});

    // Notify customer
    if (newStatus === 'on-the-way' && !customerNotified) {
      notifyCustomer();
    }

    // If delivered, navigate back to dashboard
    if (newStatus === 'delivered') {
      setTimeout(() => {
        navigate('/delivery');
      }, 2000);
    }
  };

  const notifyCustomer = () => {
    // Simulate customer notification
    setCustomerNotified(true);
    alert(`Customer ${order?.customer.name} notified: "Your order is on the way! Delivery boy: ${order?.deliveryBoy.name} (${order?.deliveryBoy.phone})"`);
  };

  const openGoogleMaps = () => {
    if (!order?.customer.coordinates) return;
    
    const { lat, lng } = order.customer.coordinates;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
    window.open(url, '_blank');
  };

  const callCustomer = () => {
    if (!order) return;
    window.open(`tel:${order.customer.phone}`);
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-gray flex items-center justify-center">
        <div className="text-center">
          <Package className="w-12 h-12 text-secondary mx-auto mb-4" />
          <p className="text-secondary">Loading delivery details...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'picked-up': return 'bg-orange text-white';
      case 'on-the-way': return 'bg-blue-600 text-white';
      case 'delivered': return 'bg-green text-white';
      default: return 'bg-muted text-secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'picked-up': return 'PICKED UP';
      case 'on-the-way': return 'ON THE WAY';
      case 'delivered': return 'DELIVERED';
      default: return status.toUpperCase();
    }
  };

  return (
    <div className="min-h-screen bg-gray">
      {/* Header */}
      <div className="bg-white shadow border-b sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/delivery')}
                className="btn btn-secondary btn-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>
              <div>
                <h1 className="text-xl font-bold text-primary">Active Delivery - {order.id}</h1>
                <p className="text-secondary">Delivering to {order.customer.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentStatus)}`}>
                {getStatusText(currentStatus)}
              </span>
              <button
                onClick={() => setShowQRModal(true)}
                className="btn btn-secondary btn-sm"
              >
                <QrCode className="w-4 h-4 mr-2" />
                QR Code
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order & Customer Details */}
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-primary">Customer Details</h3>
                <button
                  onClick={callCustomer}
                  className="btn btn-primary btn-sm"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Customer
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="w-4 h-4 text-secondary" />
                  <span className="font-medium text-primary">{order.customer.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-secondary" />
                  <span className="text-secondary">{order.customer.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-secondary" />
                  <span className="text-secondary">{order.customer.email}</span>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-secondary mt-1" />
                  <span className="text-secondary">{order.customer.address}</span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="card">
              <h3 className="text-lg font-semibold text-primary mb-4">Order Items</h3>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <span className="font-medium text-primary">{item.name}</span>
                      <span className="text-secondary ml-2">x{item.quantity}</span>
                    </div>
                    <span className="font-medium text-primary">₹{item.price}</span>
                  </div>
                ))}
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-primary">Total Amount</span>
                    <span className="font-bold text-primary text-lg">₹{order.total}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <CreditCard className="w-4 h-4 text-secondary" />
                    <span className="text-secondary">
                      {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid Online'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="card">
              <h3 className="text-lg font-semibold text-primary mb-4">Delivery Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-secondary">Distance</span>
                  <span className="font-medium text-primary">{order.distance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Estimated Time</span>
                  <span className="font-medium text-primary">{order.estimatedTime} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Picked Up At</span>
                  <span className="font-medium text-primary">
                    {new Date(order.pickedUpAt).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Vehicle Number</span>
                  <span className="font-medium text-primary">{order.deliveryBoy.vehicleNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Tracking Code</span>
                  <span className="font-medium text-primary">{order.trackingCode}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Map & Actions */}
          <div className="space-y-6">
            {/* Google Maps Placeholder */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-primary">Navigation</h3>
                <button
                  onClick={openGoogleMaps}
                  className="btn btn-primary btn-sm"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Open in Maps
                </button>
              </div>
              
              <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-secondary mx-auto mb-2" />
                  <p className="text-secondary font-medium">Google Maps</p>
                  <p className="text-xs text-muted">Route to Customer</p>
                  {currentLocation && order.customer.coordinates && (
                    <div className="mt-2 text-xs text-secondary">
                      <p>From: {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}</p>
                      <p>To: {order.customer.coordinates.lat.toFixed(4)}, {order.customer.coordinates.lng.toFixed(4)}</p>
                    </div>
                  )}
                </div>
                
                {/* Fake route line */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg width="100%" height="100%" className="absolute">
                    <path
                      d="M 50 20 Q 150 50 250 180"
                      stroke="#3b82f6"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray="5,5"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Status Update Actions */}
            <div className="card">
              <h3 className="text-lg font-semibold text-primary mb-4">Update Delivery Status</h3>
              
              {currentStatus === 'picked-up' && (
                <div className="space-y-4">
                  <div className="bg-orange bg-opacity-10 border border-orange text-orange p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4" />
                      <span className="font-medium">Order Picked Up</span>
                    </div>
                    <p className="text-sm mt-1">Ready to start delivery journey</p>
                  </div>
                  <button
                    onClick={() => updateDeliveryStatus('on-the-way')}
                    className="btn btn-primary w-full"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Start Delivery (On the Way)
                  </button>
                </div>
              )}

              {currentStatus === 'on-the-way' && (
                <div className="space-y-4">
                  <div className="bg-blue-600 bg-opacity-10 border border-blue-600 text-blue-600 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Navigation className="w-4 h-4" />
                      <span className="font-medium">On the Way</span>
                    </div>
                    <p className="text-sm mt-1">Delivery in progress</p>
                  </div>
                  <button
                    onClick={() => updateDeliveryStatus('delivered')}
                    className="btn btn-primary w-full"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Delivered
                  </button>
                </div>
              )}

              {currentStatus === 'delivered' && (
                <div className="bg-green bg-opacity-10 border border-green text-green p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-medium">Delivered Successfully</span>
                  </div>
                  <p className="text-sm mt-1">Order completed</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-lg font-semibold text-primary mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={callCustomer}
                  className="btn btn-secondary"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Customer
                </button>
                <button
                  onClick={() => setShowQRModal(true)}
                  className="btn btn-secondary"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  Show QR
                </button>
                <button
                  onClick={openGoogleMaps}
                  className="btn btn-secondary"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Navigation
                </button>
                <button className="btn btn-secondary">
                  <Camera className="w-4 h-4 mr-2" />
                  Take Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-primary">Delivery Tracking QR</h3>
              <button
                onClick={() => setShowQRModal(false)}
                className="text-secondary hover:text-primary"
              >
                ×
              </button>
            </div>

            <QRCodeGenerator
              text={`${window.location.origin}/track/${order.trackingCode}`}
              size={192}
              onCopy={() => {
                console.log('Tracking QR copied');
              }}
              onDownload={() => {
                console.log('Tracking QR downloaded');
              }}
            />

            <div className="mt-4 text-center">
              <p className="text-sm text-secondary">
                Customer can scan this QR to track delivery status
              </p>
              <p className="text-xs text-muted mt-1">
                Tracking Code: {order.trackingCode}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
