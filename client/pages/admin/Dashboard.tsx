import { useEffect, useState } from "react";
import {
  BarChart3,
  ShoppingBag,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  MapPin,
} from "lucide-react";
import { apiService } from "@/lib/api";

interface DashboardStats {
  totalOrders: number;
  revenue: number;
  activeTables: number;
  avgOrderValue: number;
}

interface Order {
  _id: string;
  order_number: string;
  table_number?: string;
  service_type: string;
  items: any[];
  total_amount: number;
  status: string;
  created_at: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    revenue: 0,
    activeTables: 0,
    avgOrderValue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get restaurant ID from localStorage or use default
  const getRestaurantId = () => {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      return userData.restaurant_id || "1";
    }
    return "1"; // Default restaurant ID
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const restaurantId = getRestaurantId();

        // Fetch dashboard stats
        const statsResponse = await apiService.getDashboardStats(restaurantId);
        
        if (statsResponse.success && statsResponse.data) {
          setStats(statsResponse.data);
        } else {
          // Fallback to mock data if API fails
          setStats({
            totalOrders: 24,
            revenue: 12450,
            activeTables: 8,
            avgOrderValue: 520,
          });
        }

        // Fetch recent orders
        const ordersResponse = await apiService.getOrders(restaurantId, {
          limit: 4,
          sort: "created_at",
          order: "desc"
        });

        if (ordersResponse.success && ordersResponse.data) {
          setRecentOrders(ordersResponse.data);
        } else {
          // Fallback to mock data
          setRecentOrders([
            {
              _id: "1234",
              order_number: "ORD-1234",
              table_number: "5",
              service_type: "dining",
              items: [{}, {}, {}],
              total_amount: 850,
              status: "preparing",
              created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
            },
            {
              _id: "1233",
              order_number: "ORD-1233",
              service_type: "takeaway",
              items: [{}, {}],
              total_amount: 420,
              status: "ready",
              created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
            },
            {
              _id: "1232",
              order_number: "ORD-1232",
              table_number: "12",
              service_type: "dining",
              items: [{}, {}, {}, {}],
              total_amount: 1200,
              status: "completed",
              created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
            },
            {
              _id: "1231",
              order_number: "ORD-1231",
              service_type: "delivery",
              items: [{}, {}, {}, {}, {}],
              total_amount: 950,
              status: "out-for-delivery",
              created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            },
          ]);
        }

      } catch (error) {
        console.error("Error loading dashboard data:", error);
        setError("Failed to load dashboard data");
        
        // Set fallback data
        setStats({
          totalOrders: 24,
          revenue: 12450,
          activeTables: 8,
          avgOrderValue: 520,
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "preparing":
        return "badge badge-orange";
      case "ready":
        return "badge badge-green";
      case "completed":
        return "badge bg-muted text-secondary";
      case "out-for-delivery":
        return "badge badge-orange";
      default:
        return "badge bg-muted text-secondary";
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const orderTime = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - orderTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} mins ago`;
    } else {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    }
  };

  const getDisplayTable = (order: Order) => {
    if (order.table_number) {
      return `Table ${order.table_number}`;
    }
    return order.service_type === "takeaway" ? "Takeaway" : "Delivery";
  };

  const dashboardStats = [
    {
      name: "Total Orders Today",
      value: stats.totalOrders.toString(),
      change: "+12%",
      icon: ShoppingBag,
      color: "bg-orange",
    },
    {
      name: "Revenue Today",
      value: `₹${stats.revenue.toLocaleString()}`,
      change: "+18%",
      icon: DollarSign,
      color: "bg-green",
    },
    {
      name: "Active Tables",
      value: `${stats.activeTables}/15`,
      change: "53%",
      icon: Users,
      color: "bg-orange",
    },
    {
      name: "Avg Order Value",
      value: `₹${stats.avgOrderValue}`,
      change: "+8%",
      icon: TrendingUp,
      color: "bg-green",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-secondary">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
        <p className="text-secondary">Welcome to Spice Garden Admin Panel</p>
        {error && (
          <div className="mt-2 p-2 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
            {error} - Showing demo data
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary">{stat.name}</p>
                  <p className="text-2xl font-bold text-primary mt-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-green mt-1">
                    {stat.change} from yesterday
                  </p>
                </div>
                <div
                  className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}
                >
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
            <h2 className="text-lg font-semibold text-primary">
              Recent Orders
            </h2>
            <a href="/admin/orders" className="text-sm text-orange font-medium">
              View All
            </a>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order._id}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange rounded-lg flex items-center justify-center">
                    {order.service_type === "dining"
                      ? "🍽️"
                      : order.service_type === "takeaway"
                        ? "🥡"
                        : "🚚"}
                  </div>
                  <div>
                    <p className="font-medium text-primary">{order.order_number}</p>
                    <p className="text-sm text-secondary">
                      {getDisplayTable(order)} • {order.items.length} items
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary">₹{order.total_amount}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={getStatusBadge(order.status)}>
                      {order.status.replace("-", " ")}
                    </span>
                  </div>
                  <p className="text-xs text-secondary mt-1">
                    {getTimeAgo(order.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Tables */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-primary">
              Active Tables
            </h2>
            <span className="text-sm text-secondary">{stats.activeTables} of 15 occupied</span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 15 }, (_, i) => i + 1).map((tableNum) => {
              const isOccupied = [1, 3, 5, 7, 8, 10, 12, 15].includes(tableNum);
              return (
                <div
                  key={tableNum}
                  className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium ${
                    isOccupied
                      ? "bg-orange text-white"
                      : "bg-muted text-secondary"
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
        <h2 className="text-lg font-semibold text-primary mb-4">
          Today's Performance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-orange rounded-full flex items-center justify-center mx-auto mb-3">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
            <p className="text-2xl font-bold text-primary">{stats.totalOrders}</p>
            <p className="text-sm text-secondary">Total Orders</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green rounded-full flex items-center justify-center mx-auto mb-3">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <p className="text-2xl font-bold text-primary">₹{stats.revenue.toLocaleString()}</p>
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
