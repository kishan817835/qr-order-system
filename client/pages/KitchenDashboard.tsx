import { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertCircle, Truck } from 'lucide-react';

type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'out-for-delivery';
type ServiceType = 'dining' | 'takeaway' | 'delivery';

interface KitchenOrder {
  id: string;
  items: Array<{
    name: string;
    quantity: number;
    notes?: string;
  }>;
  serviceType: ServiceType;
  table?: string;
  customerName?: string;
  status: OrderStatus;
  createdAt: string;
  estimatedTime: number;
}

export default function KitchenDashboard() {
  const [filter, setFilter] = useState<ServiceType | 'all'>('all');
  const [orders, setOrders] = useState<KitchenOrder[]>([
    {
      id: '#1234',
      items: [
        { name: 'Butter Chicken', quantity: 2 },
        { name: 'Garlic Naan', quantity: 4 },
        { name: 'Basmati Rice', quantity: 2 }
      ],
      serviceType: 'dining',
      table: 'Table 5',
      status: 'preparing',
      createdAt: new Date(Date.now() - 900000).toISOString(),
      estimatedTime: 15
    },
    {
      id: '#1235',
      items: [
        { name: 'Paneer Tikka', quantity: 1 },
        { name: 'Mango Lassi', quantity: 2 }
      ],
      serviceType: 'takeaway',
      customerName: 'Rahul Sharma',
      status: 'pending',
      createdAt: new Date(Date.now() - 300000).toISOString(),
      estimatedTime: 20
    },
    {
      id: '#1236',
      items: [
        { name: 'Biryani Special', quantity: 1 },
        { name: 'Raita', quantity: 1 },
        { name: 'Gulab Jamun', quantity: 2 }
      ],
      serviceType: 'delivery',
      customerName: 'Priya Singh',
      status: 'ready',
      createdAt: new Date(Date.now() - 1200000).toISOString(),
      estimatedTime: 5
    }
  ]);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const getTimeElapsed = (createdAt: string) => {
    const diffMs = currentTime.getTime() - new Date(createdAt).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    return diffMins;
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'bg-red text-white';
      case 'preparing': return 'bg-orange text-white';
      case 'ready': return 'bg-green text-white';
      case 'out-for-delivery': return 'bg-orange text-white';
      default: return 'bg-muted text-secondary';
    }
  };

  const getServiceIcon = (serviceType: ServiceType) => {
    switch (serviceType) {
      case 'dining': return '🍽️';
      case 'takeaway': return '🥡';
      case 'delivery': return '🚚';
    }
  };

  const pendingOrders = orders.filter(order => order.status === 'pending');
  const preparingOrders = orders.filter(order => order.status === 'preparing');
  const readyOrders = orders.filter(order => order.status === 'ready' || order.status === 'out-for-delivery');

  return (
    <div className="min-h-screen bg-gray">
      {/* Header */}
      <div className="bg-white shadow border-b sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">Kitchen Dashboard</h1>
              <p className="text-secondary">Manage order preparation and status</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-lg font-bold text-primary">{orders.length}</div>
                <div className="text-xs text-secondary">Total Orders</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange">{preparingOrders.length}</div>
                <div className="text-xs text-secondary">Preparing</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-red">{pendingOrders.length}</div>
                <div className="text-xs text-secondary">Pending</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Orders */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red" />
              <h2 className="text-lg font-semibold text-primary">Pending ({pendingOrders.length})</h2>
            </div>
            
            {pendingOrders.map((order) => (
              <div key={order.id} className="card border-l-4 border-red">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getServiceIcon(order.serviceType)}</span>
                    <div>
                      <h3 className="font-semibold text-primary">{order.id}</h3>
                      <p className="text-sm text-secondary">
                        {order.table || order.customerName} • {getTimeElapsed(order.createdAt)} min ago
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    URGENT
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-primary">{item.quantity}x {item.name}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => updateOrderStatus(order.id, 'preparing')}
                  className="btn btn-primary w-full"
                >
                  Start Preparing
                </button>
              </div>
            ))}

            {pendingOrders.length === 0 && (
              <div className="text-center py-8 text-secondary">
                <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No pending orders</p>
              </div>
            )}
          </div>

          {/* Preparing Orders */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-orange" />
              <h2 className="text-lg font-semibold text-primary">Preparing ({preparingOrders.length})</h2>
            </div>
            
            {preparingOrders.map((order) => (
              <div key={order.id} className="card border-l-4 border-orange">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getServiceIcon(order.serviceType)}</span>
                    <div>
                      <h3 className="font-semibold text-primary">{order.id}</h3>
                      <p className="text-sm text-secondary">
                        {order.table || order.customerName} • {getTimeElapsed(order.createdAt)} min ago
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    COOKING
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-primary">{item.quantity}x {item.name}</span>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-2">
                  {order.serviceType === 'delivery' ? (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'out-for-delivery')}
                      className="btn btn-primary w-full"
                    >
                      Ready for Delivery
                    </button>
                  ) : (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                      className="btn btn-primary w-full"
                    >
                      Mark Ready
                    </button>
                  )}
                </div>
              </div>
            ))}

            {preparingOrders.length === 0 && (
              <div className="text-center py-8 text-secondary">
                <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No orders being prepared</p>
              </div>
            )}
          </div>

          {/* Ready Orders */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green" />
              <h2 className="text-lg font-semibold text-primary">Ready ({readyOrders.length})</h2>
            </div>
            
            {readyOrders.map((order) => (
              <div key={order.id} className="card border-l-4 border-green">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getServiceIcon(order.serviceType)}</span>
                    <div>
                      <h3 className="font-semibold text-primary">{order.id}</h3>
                      <p className="text-sm text-secondary">
                        {order.table || order.customerName} • {getTimeElapsed(order.createdAt)} min ago
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status === 'out-for-delivery' ? 'OUT FOR DELIVERY' : 'READY'}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-primary">{item.quantity}x {item.name}</span>
                    </div>
                  ))}
                </div>

                {order.status === 'ready' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'completed')}
                    className="btn btn-secondary w-full"
                  >
                    Mark as Served
                  </button>
                )}

                {order.status === 'out-for-delivery' && (
                  <div className="flex items-center justify-center text-orange p-2">
                    <Truck className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Out for delivery</span>
                  </div>
                )}
              </div>
            ))}

            {readyOrders.length === 0 && (
              <div className="text-center py-8 text-secondary">
                <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No orders ready</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
