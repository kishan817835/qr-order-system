import { useState } from 'react';
import { Clock, MapPin, Phone, Filter, Search, RefreshCw } from 'lucide-react';

type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled' | 'out-for-delivery';
type ServiceType = 'dining' | 'takeaway' | 'delivery';

interface Order {
  id: string;
  customerName?: string;
  table?: string;
  serviceType: ServiceType;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: OrderStatus;
  createdAt: string;
  phone?: string;
  address?: string;
}

export default function Orders() {
  const [filter, setFilter] = useState<ServiceType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock orders data
  const orders: Order[] = [
    {
      id: '#1234',
      table: 'Table 5',
      serviceType: 'dining',
      items: [
        { name: 'Butter Chicken', quantity: 2, price: 380 },
        { name: 'Naan', quantity: 4, price: 60 }
      ],
      total: 1000,
      status: 'preparing',
      createdAt: new Date(Date.now() - 600000).toISOString()
    },
    {
      id: '#1233',
      customerName: 'Rahul Sharma',
      serviceType: 'takeaway',
      items: [
        { name: 'Paneer Tikka', quantity: 1, price: 220 },
        { name: 'Lassi', quantity: 2, price: 120 }
      ],
      total: 460,
      status: 'ready',
      createdAt: new Date(Date.now() - 900000).toISOString(),
      phone: '+91 98765 43210'
    },
    {
      id: '#1232',
      table: 'Table 12',
      serviceType: 'dining',
      items: [
        { name: 'Biryani Special', quantity: 2, price: 450 },
        { name: 'Raita', quantity: 2, price: 80 }
      ],
      total: 1060,
      status: 'completed',
      createdAt: new Date(Date.now() - 1500000).toISOString()
    },
    {
      id: '#1231',
      customerName: 'Priya Singh',
      serviceType: 'delivery',
      items: [
        { name: 'Dal Makhani', quantity: 1, price: 280 },
        { name: 'Roti', quantity: 6, price: 40 },
        { name: 'Rice', quantity: 2, price: 120 }
      ],
      total: 880,
      status: 'out-for-delivery',
      createdAt: new Date(Date.now() - 1800000).toISOString(),
      phone: '+91 87654 32109',
      address: '123 Main Street, Sector 15'
    }
  ];

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    // In real app, this would update the database
    console.log(`Updating order ${orderId} to ${newStatus}`);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'badge bg-muted text-secondary';
      case 'preparing':
        return 'badge badge-orange';
      case 'ready':
        return 'badge badge-green';
      case 'completed':
        return 'badge bg-muted text-secondary';
      case 'cancelled':
        return 'badge badge-red';
      case 'out-for-delivery':
        return 'badge badge-orange';
      default:
        return 'badge bg-muted text-secondary';
    }
  };

  const getServiceIcon = (serviceType: ServiceType) => {
    switch (serviceType) {
      case 'dining':
        return '🍽️';
      case 'takeaway':
        return '🥡';
      case 'delivery':
        return '🚚';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesService = filter === 'all' || order.serviceType === filter;
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.table?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesService && matchesStatus && matchesSearch;
  });

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins} mins ago`;
    } else {
      const diffHours = Math.floor(diffMins / 60);
      return `${diffHours}h ${diffMins % 60}m ago`;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Orders</h1>
          <p className="text-secondary">Manage all restaurant orders</p>
        </div>
        <button className="btn btn-primary">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="form-label">Search Orders</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" />
              <input
                type="text"
                placeholder="Search by order ID, customer name, or table..."
                className="form-input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="form-label">Service Type</label>
            <select 
              className="form-input"
              value={filter}
              onChange={(e) => setFilter(e.target.value as ServiceType | 'all')}
            >
              <option value="all">All Services</option>
              <option value="dining">Dining</option>
              <option value="takeaway">Takeaway</option>
              <option value="delivery">Delivery</option>
            </select>
          </div>
          <div>
            <label className="form-label">Status</label>
            <select 
              className="form-input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="out-for-delivery">Out for Delivery</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Order Details</th>
              <th>Items</th>
              <th>Customer Info</th>
              <th>Total</th>
              <th>Status</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td>
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{getServiceIcon(order.serviceType)}</span>
                    <div>
                      <p className="font-semibold text-primary">{order.id}</p>
                      <p className="text-sm text-secondary capitalize">{order.serviceType}</p>
                      {order.table && (
                        <p className="text-sm text-orange">{order.table}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="space-y-1">
                    {order.items.map((item, index) => (
                      <div key={index} className="text-sm">
                        <span className="text-primary">{item.quantity}x {item.name}</span>
                      </div>
                    ))}
                  </div>
                </td>
                <td>
                  <div>
                    {order.customerName && (
                      <p className="font-medium text-primary">{order.customerName}</p>
                    )}
                    {order.phone && (
                      <p className="text-sm text-secondary flex items-center">
                        <Phone className="w-3 h-3 mr-1" />
                        {order.phone}
                      </p>
                    )}
                    {order.address && (
                      <p className="text-sm text-secondary flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {order.address}
                      </p>
                    )}
                  </div>
                </td>
                <td>
                  <span className="font-semibold text-primary">₹{order.total}</span>
                </td>
                <td>
                  <span className={getStatusBadge(order.status)}>
                    {order.status.replace('-', ' ')}
                  </span>
                </td>
                <td>
                  <div className="flex items-center text-sm text-secondary">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTime(order.createdAt)}
                  </div>
                </td>
                <td>
                  <div className="space-y-2">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                        className="btn btn-primary btn-sm w-full"
                      >
                        Start Preparing
                      </button>
                    )}
                    {order.status === 'preparing' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, order.serviceType === 'delivery' ? 'out-for-delivery' : 'ready')}
                        className="btn btn-primary btn-sm w-full"
                      >
                        Mark {order.serviceType === 'delivery' ? 'Out for Delivery' : 'Ready'}
                      </button>
                    )}
                    {(order.status === 'ready' || order.status === 'out-for-delivery') && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'completed')}
                        className="btn btn-primary btn-sm w-full"
                      >
                        Complete Order
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredOrders.length === 0 && (
          <div className="text-center py-8">
            <p className="text-secondary">No orders found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
