import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, CreditCard, Clock, CheckCircle, Truck, User, LogOut, ChevronDown, X } from 'lucide-react';
import ProfileCard from '../components/ProfileCard';

type DeliveryStatus = 'ready-for-pickup' | 'picked-up' | 'on-the-way' | 'delivered';
type PaymentStatus = 'cod' | 'paid-online';

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
  };
  total: number;
  paymentMethod: PaymentStatus;
  status: DeliveryStatus;
  estimatedTime: number;
  preparedAt: string;
  distance: string;
}

export default function DeliveryDashboard() {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  const [deliveryProfile, setDeliveryProfile] = useState({
    id: 1,
    name: 'Raj Kumar',
    email: 'raj.kumar@spicegarden.com',
    phone: '+91 98765 11111',
    address: 'Delivery Staff Quarters, Delhi',
    photo: null,
    role: 'delivery'
  });

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('userRole');
      navigate('/login');
    }
  };

  const handleUpdateProfile = (updatedProfile: any) => {
    setDeliveryProfile(updatedProfile);
  };
  const [orders, setOrders] = useState<DeliveryOrder[]>([
    {
      id: '#1236',
      items: [
        { name: 'Biryani Special', quantity: 1, price: 450 },
        { name: 'Raita', quantity: 1, price: 80 },
        { name: 'Gulab Jamun', quantity: 2, price: 150 }
      ],
      customer: {
        name: 'Priya Singh',
        email: 'priya.singh@email.com',
        phone: '+91 98765 43210',
        address: '123 Main Street, Sector 15, New Delhi - 110001'
      },
      total: 880,
      paymentMethod: 'cod',
      status: 'ready-for-pickup',
      estimatedTime: 25,
      preparedAt: new Date(Date.now() - 300000).toISOString(),
      distance: '2.5 km'
    },
    {
      id: '#1238',
      items: [
        { name: 'Chicken Curry', quantity: 1, price: 350 },
        { name: 'Rice', quantity: 1, price: 120 },
        { name: 'Naan', quantity: 2, price: 60 }
      ],
      customer: {
        name: 'Amit Kumar',
        email: 'amit.kumar@email.com',
        phone: '+91 87654 32109',
        address: '456 Park Avenue, Block A, Gurgaon - 122001'
      },
      total: 590,
      paymentMethod: 'paid-online',
      status: 'picked-up',
      estimatedTime: 30,
      preparedAt: new Date(Date.now() - 600000).toISOString(),
      distance: '3.2 km'
    },
    {
      id: '#1240',
      items: [
        { name: 'Dal Makhani', quantity: 1, price: 280 },
        { name: 'Butter Chicken', quantity: 1, price: 380 },
        { name: 'Garlic Naan', quantity: 3, price: 60 }
      ],
      customer: {
        name: 'Neha Sharma',
        email: 'neha.sharma@email.com',
        phone: '+91 98765 12345',
        address: '789 Green Park, Phase 2, Noida - 201301'
      },
      total: 840,
      paymentMethod: 'cod',
      status: 'on-the-way',
      estimatedTime: 15,
      preparedAt: new Date(Date.now() - 1200000).toISOString(),
      distance: '1.8 km'
    }
  ]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const updateOrderStatus = (orderId: string, newStatus: DeliveryStatus) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const handlePickupOrder = (orderId: string) => {
    // Check if delivery boy already has an active delivery
    const hasActiveDelivery = orders.some(order =>
      (order.status === 'picked-up' || order.status === 'on-the-way')
    );

    if (hasActiveDelivery) {
      alert('You already have an active delivery! Please complete current delivery first.');
      return;
    }

    // Update order status to picked-up
    updateOrderStatus(orderId, 'picked-up');

    // Send notifications
    notifyStakeholders(orderId);

    // Navigate to delivery details page
    navigate(`/delivery-details/${orderId}`);
  };

  const notifyStakeholders = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    // Simulate notifications
    console.log('📱 SMS to Customer:', `Your order ${orderId} has been picked up by ${deliveryProfile.name} (${deliveryProfile.phone}). Track: ${window.location.origin}/track/TRK${Date.now()}`);
    console.log('🔔 Admin Notification:', `Order ${orderId} picked up by ${deliveryProfile.name}`);
    console.log('👨‍🍳 Kitchen Notification:', `Order ${orderId} out for delivery`);

    // Show visual confirmation
    alert(`✅ Order ${orderId} picked up!\n\n📱 Customer notified with your contact: ${deliveryProfile.phone}\n🔔 Admin & Kitchen updated`);
  };

  const getTimeSincePrepared = (preparedAt: string) => {
    const diffMs = currentTime.getTime() - new Date(preparedAt).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    return diffMins;
  };

  const getStatusColor = (status: DeliveryStatus) => {
    switch (status) {
      case 'ready-for-pickup': return 'bg-orange text-white';
      case 'picked-up': return 'bg-blue-600 text-white';
      case 'on-the-way': return 'bg-purple-600 text-white';
      case 'delivered': return 'bg-green text-white';
      default: return 'bg-muted text-secondary';
    }
  };

  const getStatusText = (status: DeliveryStatus) => {
    switch (status) {
      case 'ready-for-pickup': return 'READY FOR PICKUP';
      case 'picked-up': return 'PICKED UP';
      case 'on-the-way': return 'ON THE WAY';
      case 'delivered': return 'DELIVERED';
      default: return status.toUpperCase();
    }
  };

  const readyOrders = orders.filter(order => order.status === 'ready-for-pickup');
  const pickedUpOrders = orders.filter(order => order.status === 'picked-up');
  const onTheWayOrders = orders.filter(order => order.status === 'on-the-way');

  return (
    <div className="min-h-screen bg-gray">
      {/* Header */}
      <div className="bg-white shadow border-b sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">Delivery Dashboard</h1>
              <p className="text-secondary">Manage home delivery orders</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Active Delivery Alert */}
              {(pickedUpOrders.length > 0 || onTheWayOrders.length > 0) && (
                <div className="bg-red bg-opacity-10 border border-red text-red px-3 py-2 rounded-lg">
                  <div className="flex items-center justify-between space-x-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">Active Delivery</span>
                    </div>
                    <button
                      onClick={() => {
                        const activeOrder = [...pickedUpOrders, ...onTheWayOrders][0];
                        if (activeOrder) {
                          navigate(`/delivery-details/${activeOrder.id}`);
                        }
                      }}
                      className="bg-red text-white px-2 py-1 rounded text-xs hover:bg-red-dark transition"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              <div className="hidden md:flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">{orders.length}</div>
                  <div className="text-xs text-secondary">Total Deliveries</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange">{readyOrders.length}</div>
                  <div className="text-xs text-secondary">Ready for Pickup</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{onTheWayOrders.length}</div>
                  <div className="text-xs text-secondary">On the Way</div>
                </div>
              </div>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center space-x-3 p-2 rounded-lg border hover:bg-gray transition"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    {deliveryProfile.photo ? (
                      <img src={deliveryProfile.photo} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className="text-left hidden md:block">
                    <p className="text-sm font-medium text-primary">{deliveryProfile.name}</p>
                    <p className="text-xs text-secondary">Delivery Boy</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-secondary" />
                </button>

                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border z-50">
                    <div className="p-4">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                          {deliveryProfile.photo ? (
                            <img src={deliveryProfile.photo} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
                          ) : (
                            <User className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-primary">{deliveryProfile.name}</p>
                          <p className="text-sm text-secondary">{deliveryProfile.email}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            setShowProfileModal(true);
                            setShowProfileDropdown(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-primary hover:bg-gray rounded-md transition"
                        >
                          <User className="w-4 h-4 mr-2 inline" />
                          View Profile
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-3 py-2 text-sm text-red hover:bg-gray rounded-md transition"
                        >
                          <LogOut className="w-4 h-4 mr-2 inline" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ready for Pickup */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Truck className="w-5 h-5 text-orange" />
              <h2 className="text-lg font-semibold text-primary">Ready for Pickup ({readyOrders.length})</h2>
            </div>
            
            {readyOrders.map((order) => (
              <div key={order.id} className="card border-l-4 border-orange">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-primary">{order.id}</h3>
                    <p className="text-sm text-secondary">
                      Prepared {getTimeSincePrepared(order.preparedAt)} min ago
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>

                {/* Customer Details */}
                <div className="bg-muted p-3 rounded-lg mb-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="w-4 h-4 text-primary" />
                    <span className="font-medium text-primary">{order.customer.name}</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-3 h-3 text-secondary" />
                      <span className="text-secondary">{order.customer.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-3 h-3 text-secondary" />
                      <span className="text-secondary">{order.customer.email}</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-3 h-3 text-secondary mt-1" />
                      <span className="text-secondary">{order.customer.address}</span>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="space-y-2 mb-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-primary">{item.quantity}x {item.name}</span>
                      <span className="text-primary">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₹{order.total}</span>
                  </div>
                </div>

                {/* Payment Status */}
                <div className="flex items-center space-x-2 mb-3">
                  <CreditCard className="w-4 h-4 text-secondary" />
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    order.paymentMethod === 'paid-online' ? 'bg-green text-white' : 'bg-orange text-white'
                  }`}>
                    {order.paymentMethod === 'paid-online' ? 'PAID ONLINE' : 'CASH ON DELIVERY'}
                  </span>
                  <span className="text-sm text-secondary">• {order.distance}</span>
                </div>

                <button
                  onClick={() => handlePickupOrder(order.id)}
                  className="btn btn-primary w-full"
                >
                  Pick Up Order
                </button>
              </div>
            ))}

            {readyOrders.length === 0 && (
              <div className="text-center py-8 text-secondary">
                <Truck className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No orders ready for pickup</p>
              </div>
            )}
          </div>

          {/* Picked Up Orders */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-primary">Picked Up ({pickedUpOrders.length})</h2>
            </div>
            
            {pickedUpOrders.map((order) => (
              <div key={order.id} className="card border-l-4 border-blue-600">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-primary">{order.id}</h3>
                    <p className="text-sm text-secondary">
                      {order.customer.name} • {order.distance}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg mb-3">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-blue-600 mt-1" />
                    <span className="text-sm text-blue-800">{order.customer.address}</span>
                  </div>
                </div>

                <div className="text-sm text-secondary mb-3">
                  <div className="flex justify-between">
                    <span>Payment:</span>
                    <span className={`font-medium ${
                      order.paymentMethod === 'paid-online' ? 'text-green' : 'text-orange'
                    }`}>
                      {order.paymentMethod === 'paid-online' ? 'Paid Online' : 'Cash on Delivery'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-bold">₹{order.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ETA:</span>
                    <span className="font-medium">{order.estimatedTime} min</span>
                  </div>
                </div>

                <button
                  onClick={() => updateOrderStatus(order.id, 'on-the-way')}
                  className="btn btn-primary w-full"
                >
                  Start Delivery
                </button>
              </div>
            ))}

            {pickedUpOrders.length === 0 && (
              <div className="text-center py-8 text-secondary">
                <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No orders picked up</p>
              </div>
            )}
          </div>

          {/* On the Way Orders */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-primary">On the Way ({onTheWayOrders.length})</h2>
            </div>
            
            {onTheWayOrders.map((order) => (
              <div key={order.id} className="card border-l-4 border-purple-600">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-primary">{order.id}</h3>
                    <p className="text-sm text-secondary">
                      {order.customer.name} • ETA: {order.estimatedTime} min
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>

                <div className="bg-purple-50 p-3 rounded-lg mb-3">
                  <div className="flex items-start space-x-2 mb-2">
                    <MapPin className="w-4 h-4 text-purple-600 mt-1" />
                    <span className="text-sm text-purple-800">{order.customer.address}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-purple-800">{order.customer.phone}</span>
                  </div>
                </div>

                <div className="text-sm text-secondary mb-3">
                  <div className="flex justify-between items-center">
                    <span>Payment:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      order.paymentMethod === 'paid-online' ? 'bg-green text-white' : 'bg-orange text-white'
                    }`}>
                      {order.paymentMethod === 'paid-online' ? 'PAID' : `COLLECT ₹${order.total}`}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => updateOrderStatus(order.id, 'delivered')}
                  className="btn btn-primary w-full"
                >
                  Mark as Delivered
                </button>
              </div>
            ))}

            {onTheWayOrders.length === 0 && (
              <div className="text-center py-8 text-secondary">
                <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No orders on the way</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-primary">Delivery Boy Profile</h3>
              <button
                onClick={() => {
                  setShowProfileModal(false);
                  setIsEditingProfile(false);
                }}
                className="text-secondary hover:text-primary"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <ProfileCard
              user={deliveryProfile}
              onUpdateProfile={handleUpdateProfile}
              isEditing={isEditingProfile}
              onEditToggle={() => setIsEditingProfile(!isEditingProfile)}
            />
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {showProfileDropdown && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowProfileDropdown(false)}
        />
      )}
    </div>
  );
}
