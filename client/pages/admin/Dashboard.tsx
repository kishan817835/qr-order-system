import { BarChart3, ShoppingBag, Users, DollarSign, TrendingUp, Clock, MapPin } from 'lucide-react';

export default function Dashboard() {
  // Mock data for dashboard
  const stats = [
    {
      name: 'Total Orders Today',
      value: '24',
      change: '+12%',
      icon: ShoppingBag,
      color: 'bg-orange'
    },
    {
      name: 'Revenue Today',
      value: '₹12,450',
      change: '+18%',
      icon: DollarSign,
      color: 'bg-green'
    },
    {
      name: 'Active Tables',
      value: '8/15',
      change: '53%',
      icon: Users,
      color: 'bg-orange'
    },
    {
      name: 'Avg Order Value',
      value: '₹520',
      change: '+8%',
      icon: TrendingUp,
      color: 'bg-green'
    }
  ];

  const recentOrders = [
    {
      id: '#1234',
      table: 'Table 5',
      type: 'dining',
      items: 3,
      amount: 850,
      status: 'preparing',
      time: '10 mins ago'
    },
    {
      id: '#1233',
      table: 'Takeaway',
      type: 'takeaway',
      items: 2,
      amount: 420,
      status: 'ready',
      time: '15 mins ago'
    },
    {
      id: '#1232',
      table: 'Table 12',
      type: 'dining',
      items: 4,
      amount: 1200,
      status: 'completed',
      time: '25 mins ago'
    },
    {
      id: '#1231',
      table: 'Delivery',
      type: 'delivery',
      items: 5,
      amount: 950,
      status: 'out-for-delivery',
      time: '30 mins ago'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'preparing':
        return 'badge badge-orange';
      case 'ready':
        return 'badge badge-green';
      case 'completed':
        return 'badge bg-muted text-secondary';
      case 'out-for-delivery':
        return 'badge badge-orange';
      default:
        return 'badge bg-muted text-secondary';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
        <p className="text-secondary">Welcome to Spice Garden Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary">{stat.name}</p>
                  <p className="text-2xl font-bold text-primary mt-1">{stat.value}</p>
                  <p className="text-sm text-green mt-1">{stat.change} from yesterday</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-primary">Recent Orders</h2>
            <a href="/admin/orders" className="text-sm text-orange font-medium">View All</a>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange rounded-lg flex items-center justify-center">
                    {order.type === 'dining' ? '🍽️' : order.type === 'takeaway' ? '🥡' : '🚚'}
                  </div>
                  <div>
                    <p className="font-medium text-primary">{order.id}</p>
                    <p className="text-sm text-secondary">{order.table} • {order.items} items</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary">₹{order.amount}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={getStatusBadge(order.status)}>
                      {order.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Tables */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-primary">Active Tables</h2>
            <span className="text-sm text-secondary">8 of 15 occupied</span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 15 }, (_, i) => i + 1).map((tableNum) => {
              const isOccupied = [1, 3, 5, 7, 8, 10, 12, 15].includes(tableNum);
              return (
                <div
                  key={tableNum}
                  className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium ${
                    isOccupied 
                      ? 'bg-orange text-white' 
                      : 'bg-muted text-secondary'
                  }`}
                >
                  {tableNum}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Today's Performance */}
      <div className="card mt-6">
        <h2 className="text-lg font-semibold text-primary mb-4">Today's Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-orange rounded-full flex items-center justify-center mx-auto mb-3">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
            <p className="text-2xl font-bold text-primary">24</p>
            <p className="text-sm text-secondary">Total Orders</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green rounded-full flex items-center justify-center mx-auto mb-3">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <p className="text-2xl font-bold text-primary">₹12,450</p>
            <p className="text-sm text-secondary">Revenue</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <p className="text-2xl font-bold text-primary">18 min</p>
            <p className="text-sm text-secondary">Avg Prep Time</p>
          </div>
        </div>
      </div>
    </div>
  );
}
