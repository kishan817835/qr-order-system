import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Phone,
  Mail,
  Building2,
  Calendar,
  Activity,
} from "lucide-react";
import apiService from "@/lib/api";

interface Admin {
  _id: string;
  name: string;
  email: string;
  phone: string;
  restaurant_id: {
    _id: string;
    name: string;
    address: string;
  };
  createdAt: string;
  last_login?: string;
  is_active: boolean;
}

interface AdminsResponse {
  admins: Admin[];
  pagination: {
    current: number;
    pages: number;
    total: number;
  };
}

export default function AdminsManagement() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Mock data for demonstration
  const mockAdmins: Admin[] = [
    {
      _id: "1",
      name: "John Doe",
      email: "john@restaurant.com",
      phone: "+91 98765 43210",
      restaurant_id: {
        _id: "rest1",
        name: "Spice Garden",
        address: "123 Main Street, Food District",
      },
      createdAt: "2024-01-15T00:00:00Z",
      last_login: "2024-01-20T00:00:00Z",
      is_active: true,
    },
    {
      _id: "2",
      name: "Jane Smith",
      email: "jane@oceanview.com",
      phone: "+91 87654 32109",
      restaurant_id: {
        _id: "rest2",
        name: "Ocean View",
        address: "456 Beach Road, Coastal Area",
      },
      createdAt: "2024-01-10T00:00:00Z",
      last_login: "2024-01-19T00:00:00Z",
      is_active: true,
    },
  ];

  const fetchAdmins = async (page = 1, search = "") => {
    try {
      setLoading(true);

      // Try to fetch from API, fallback to mock data
      const result = await apiService.getSuperAdminAdmins({
        page,
        search,
        limit: 20,
      });

      if (result.success) {
        const data = result.data as AdminsResponse;
        setAdmins(data.admins);
        setCurrentPage(data.pagination.current);
        setTotalPages(data.pagination.pages);
        setTotal(data.pagination.total);
        setError(null);
      } else {
        // Fallback to mock data
        console.log("Using mock data:", result.error);
        setAdmins(mockAdmins);
        setTotal(mockAdmins.length);
        setTotalPages(1);
        setCurrentPage(1);
        setError(null);
      }
    } catch (err) {
      console.log("Using mock data due to error:", err);
      // Fallback to mock data
      setAdmins(mockAdmins);
      setTotal(mockAdmins.length);
      setTotalPages(1);
      setCurrentPage(1);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins(1, searchTerm);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchAdmins(1, searchTerm);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchAdmins(page, searchTerm);
  };

  const toggleAdminStatus = async (adminId: string, currentStatus: boolean) => {
    try {
      const result = await apiService.updateSuperAdminAdmin(adminId, {
        is_active: !currentStatus,
      });

      if (result.success) {
        // Refresh the list
        fetchAdmins(currentPage, searchTerm);
      } else {
        alert(result.error || "Failed to update admin status");
      }
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Failed to update admin status",
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Management
              </h1>
              <p className="text-gray-600">Manage restaurant administrators</p>
            </div>
            <Link to="/super-admin/create-admin" className="btn btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Create Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="card mb-6">
          <form onSubmit={handleSearch} className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </form>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Admins</p>
                <p className="text-2xl font-bold text-primary">{total}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Admins</p>
                <p className="text-2xl font-bold text-primary">
                  {admins.filter((admin) => admin.is_active).length}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Recent Logins</p>
                <p className="text-2xl font-bold text-primary">
                  {
                    admins.filter((admin) => {
                      if (!admin.last_login) return false;
                      const lastLogin = new Date(admin.last_login);
                      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
                      return lastLogin > dayAgo;
                    }).length
                  }
                </p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Admins Table */}
        <div className="card overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Activity className="w-8 h-8 text-orange-600 animate-pulse" />
              <span className="ml-2 text-gray-600">Loading admins...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => fetchAdmins(currentPage, searchTerm)}
                className="btn btn-primary"
              >
                Retry
              </button>
            </div>
          ) : admins.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No admins found</p>
              <Link to="/super-admin/create-admin" className="btn btn-primary">
                Create First Admin
              </Link>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Admin Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Restaurant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Login
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {admins.map((admin) => (
                      <tr key={admin._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="font-medium text-gray-900">
                              {admin.name}
                            </p>
                            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Mail className="w-3 h-3 mr-1" />
                                {admin.email}
                              </div>
                              <div className="flex items-center">
                                <Phone className="w-3 h-3 mr-1" />
                                {admin.phone}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="font-medium text-gray-900">
                              {admin.restaurant_id.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {admin.restaurant_id.address}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(admin.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {admin.last_login
                            ? new Date(admin.last_login).toLocaleDateString()
                            : "Never"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() =>
                              toggleAdminStatus(admin._id, admin.is_active)
                            }
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              admin.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {admin.is_active ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Link
                              to={`/super-admin/restaurants/${admin.restaurant_id._id}`}
                              className="text-blue-600 hover:text-blue-900"
                              title="View Restaurant"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              to={`/super-admin/admins/${admin._id}/edit`}
                              className="text-orange-600 hover:text-orange-900"
                              title="Edit Admin"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Showing {(currentPage - 1) * 20 + 1} to{" "}
                      {Math.min(currentPage * 20, total)} of {total} admins
                    </p>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="btn btn-secondary btn-sm disabled:opacity-50"
                      >
                        Previous
                      </button>
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          const page = i + 1;
                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`btn btn-sm ${
                                page === currentPage
                                  ? "btn-primary"
                                  : "btn-secondary"
                              }`}
                            >
                              {page}
                            </button>
                          );
                        },
                      )}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="btn btn-secondary btn-sm disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
