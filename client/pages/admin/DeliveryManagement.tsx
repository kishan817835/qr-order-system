import { useState } from 'react';
import { User, Truck, MapPin, Phone, Clock, CheckCircle, AlertCircle } from 'lucide-react';

type DeliveryStatus = 'ready-for-pickup' | 'picked-up' | 'on-the-way' | 'delivered';

interface DeliveryBoy {
  id: number;
  name: string;
  phone: string;
  email: string;
  status: 'active' | 'busy' | 'offline';
  currentDeliveries: number;
  completedToday: number;
}

interface DeliveryOrder {
  id: string;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  items: Array<{
    name: string;
    quantity: number;
  }>;
  total: number;
  paymentMethod: 'cod' | 'paid-online';
  status: DeliveryStatus;
  assignedTo: number | null;
  estimatedTime: number;
  createdAt: string;
  pickedUpAt?: string;
  deliveredAt?: string;
}

export default function DeliveryManagement() {
  const [deliveryBoys, setDeliveryBoys] = useState<DeliveryBoy[]>([
    {
      id: 1,
      name: 'Raj Kumar',
      phone: '+91 98765 11111',
      email: 'raj.kumar@spicegarden.com',
      status: 'active',
      currentDeliveries: 2,
      completedToday: 8
    },
    {
      id: 2,
      name: 'Amit Singh',
      phone: '+91 98765 22222',
      email: 'amit.singh@spicegarden.com',
      status: 'busy',
      currentDeliveries: 3,
      completedToday: 12
    },
    {
      id: 3,
      name: 'Vikash Sharma',
      phone: '+91 98765 33333',
      email: 'vikash.sharma@spicegarden.com',
      status: 'offline',
      currentDeliveries: 0,
      completedToday: 5
    }
  ]);

  const [deliveryOrders, setDeliveryOrders] = useState<DeliveryOrder[]>([
    {
      id: '#1236',
      customer: {
        name: 'Priya Singh',
        phone: '+91 98765 43210',
        address: '123 Main Street, Sector 15, New Delhi - 110001'
      },
      items: [
        { name: 'Biryani Special', quantity: 1 },
        { name: 'Raita', quantity: 1 }
      ],
      total: 880,
      paymentMethod: 'cod',
      status: 'ready-for-pickup',
      assignedTo: null,
      estimatedTime: 25,
      createdAt: new Date(Date.now() - 300000).toISOString()
    },
    {
      id: '#1238',
      customer: {
        name: 'Amit Kumar',
        phone: '+91 87654 32109',
        address: '456 Park Avenue, Block A, Gurgaon - 122001'
      },
      items: [
        { name: 'Chicken Curry', quantity: 1 },
        { name: 'Rice', quantity: 1 }
      ],
      total: 590,
      paymentMethod: 'paid-online',
      status: 'picked-up',
      assignedTo: 1,
      estimatedTime: 30,
      createdAt: new Date(Date.now() - 600000).toISOString(),
      pickedUpAt: new Date(Date.now() - 300000).toISOString()
    },
    {
      id: '#1240',
      customer: {
        name: 'Neha Sharma',
        phone: '+91 98765 12345',
        address: '789 Green Park, Phase 2, Noida - 201301'
      },
      items: [
        { name: 'Dal Makhani', quantity: 1 },
        { name: 'Butter Chicken', quantity: 1 }
      ],
      total: 840,
      paymentMethod: 'cod',
      status: 'on-the-way',
      assignedTo: 2,
      estimatedTime: 15,
      createdAt: new Date(Date.now() - 1200000).toISOString(),
      pickedUpAt: new Date(Date.now() - 900000).toISOString()
    }
  ]);

  const assignDeliveryBoy = (orderId: string, deliveryBoyId: number) => {
    setDeliveryOrders(orders =>
      orders.map(order =>
        order.id === orderId ? { ...order, assignedTo: deliveryBoyId } : order
      )
    );
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

  const getDeliveryBoyStatus = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green text-white';
      case 'busy': return 'bg-orange text-white';
      case 'offline': return 'bg-red text-white';
      default: return 'bg-muted text-secondary';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    return `${diffMins} min ago`;
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary">Delivery Management</h1>
        <p className="text-secondary">Monitor delivery boys and assign orders</p>
      </div>

      {/* Delivery Boys Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {deliveryBoys.map((boy) => (
          <div key={boy.id} className="card">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-orange rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-primary">{boy.name}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDeliveryBoyStatus(boy.status)}`}>
                    {boy.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-secondary" />
                <span className="text-secondary">{boy.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Current Deliveries:</span>
                <span className="font-medium text-orange">{boy.currentDeliveries}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Completed Today:</span>
                <span className="font-medium text-green">{boy.completedToday}</span>
              </div>
            </div>

            <div className="mt-4">
              <button className="btn btn-secondary btn-sm w-full">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Active Deliveries */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-primary">Active Delivery Orders</h2>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange rounded-full"></div>
              <span>Unassigned</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <span>In Progress</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green rounded-full"></div>
              <span>Completed</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {deliveryOrders.map((order) => {
                const assignedBoy = order.assignedTo ? deliveryBoys.find(boy => boy.id === order.assignedTo) : null;
                return (
                  <tr key={order.id}>
                    <td>
                      <span className="font-semibold text-primary">{order.id}</span>
                    </td>
                    <td>
                      <div>
                        <p className="font-medium text-primary">{order.customer.name}</p>
                        <p className="text-sm text-secondary">{order.customer.phone}</p>
                        <p className="text-xs text-muted line-clamp-1">{order.customer.address}</p>
                      </div>
                    </td>
                    <td>
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="text-sm text-secondary">
                            {item.quantity}x {item.name}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div>
                        <span className="font-semibold text-primary">₹{order.total}</span>
                        <div className={`text-xs px-2 py-1 rounded mt-1 ${
                          order.paymentMethod === 'paid-online' ? 'bg-green text-white' : 'bg-orange text-white'
                        }`}>
                          {order.paymentMethod === 'paid-online' ? 'PAID' : 'COD'}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td>
                      {assignedBoy ? (
                        <div>
                          <p className="font-medium text-primary">{assignedBoy.name}</p>
                          <p className="text-xs text-secondary">{assignedBoy.phone}</p>
                        </div>
                      ) : (
                        <span className="text-red">Unassigned</span>
                      )}
                    </td>
                    <td>
                      <div className="text-sm text-secondary">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {formatTime(order.createdAt)}
                      </div>
                    </td>
                    <td>
                      {!order.assignedTo && order.status === 'ready-for-pickup' ? (
                        <select
                          className="form-input text-sm"
                          onChange={(e) => e.target.value && assignDeliveryBoy(order.id, parseInt(e.target.value))}
                          defaultValue=""
                        >
                          <option value="">Assign to...</option>
                          {deliveryBoys
                            .filter(boy => boy.status === 'active')
                            .map(boy => (
                              <option key={boy.id} value={boy.id}>
                                {boy.name}
                              </option>
                            ))}
                        </select>
                      ) : (
                        <div className="flex space-x-2">
                          <button className="btn btn-secondary btn-sm">
                            Track
                          </button>
                          {order.status === 'delivered' && (
                            <CheckCircle className="w-5 h-5 text-green" />
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delivery Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary">{deliveryOrders.length}</div>
          <div className="text-sm text-secondary">Total Orders</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-orange">
            {deliveryOrders.filter(o => !o.assignedTo).length}
          </div>
          <div className="text-sm text-secondary">Unassigned</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600">
            {deliveryOrders.filter(o => o.status === 'on-the-way').length}
          </div>
          <div className="text-sm text-secondary">On the Way</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green">
            {deliveryBoys.reduce((sum, boy) => sum + boy.completedToday, 0)}
          </div>
          <div className="text-sm text-secondary">Completed Today</div>
        </div>
      </div>
    </div>
  );
}
