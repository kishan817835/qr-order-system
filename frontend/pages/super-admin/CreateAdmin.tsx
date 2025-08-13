import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Building2, Plus } from "lucide-react";
import apiService from "@/lib/api";

interface Restaurant {
  _id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
}

export default function CreateAdmin() {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingRestaurants, setLoadingRestaurants] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    restaurant_id: "",
  });

  const fetchRestaurants = async () => {
    try {
      setLoadingRestaurants(true);
      const result = await apiService.getSuperAdminRestaurants({ limit: 100 });

      if (result.success) {
        // Filter restaurants that don't have an admin yet
        const restaurantsWithoutAdmin = result.data.restaurants.filter(
          (restaurant: any) => !restaurant.admin,
        );
        setRestaurants(restaurantsWithoutAdmin);
      } else {
        setError(result.error || "Failed to fetch restaurants");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch restaurants",
      );
    } finally {
      setLoadingRestaurants(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await apiService.createSuperAdminAdmin({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        restaurant_id: formData.restaurant_id,
      });

      if (result.success) {
        navigate("/super-admin/admins", {
          state: { message: "Admin created successfully" },
        });
      } else {
        setError(result.error || "Failed to create admin");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create admin");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow border-b">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Link
              to="/super-admin/admins"
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Create New Admin
              </h1>
              <p className="text-gray-600">
                Add a new restaurant administrator
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Admin Details */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Admin Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter email address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter phone number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Restaurant *
                  </label>
                  {loadingRestaurants ? (
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                      Loading restaurants...
                    </div>
                  ) : restaurants.length === 0 ? (
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                      No restaurants available (all have admins)
                    </div>
                  ) : (
                    <select
                      name="restaurant_id"
                      value={formData.restaurant_id}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      required
                    >
                      <option value="">Select a restaurant</option>
                      {restaurants.map((restaurant) => (
                        <option key={restaurant._id} value={restaurant._id}>
                          {restaurant.name} - {restaurant.address}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Security
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter password (min 6 characters)"
                    minLength={6}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Confirm password"
                    minLength={6}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Selected Restaurant Info */}
            {formData.restaurant_id && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">
                  Selected Restaurant
                </h4>
                {(() => {
                  const selectedRestaurant = restaurants.find(
                    (r) => r._id === formData.restaurant_id,
                  );
                  return selectedRestaurant ? (
                    <div className="text-sm text-blue-800">
                      <p className="font-medium">{selectedRestaurant.name}</p>
                      <p>{selectedRestaurant.address}</p>
                      <p>
                        {selectedRestaurant.phone} • {selectedRestaurant.email}
                      </p>
                    </div>
                  ) : null;
                })()}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <Link to="/super-admin/admins" className="btn btn-secondary">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading || restaurants.length === 0}
                className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Admin
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Admin Permissions</h4>
          <p className="text-sm text-gray-600 mb-2">
            The new admin will have access to:
          </p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Full restaurant management dashboard</li>
            <li>• Menu and category management</li>
            <li>• Table and QR code management</li>
            <li>• Order processing and tracking</li>
            <li>• Staff management</li>
            <li>• Analytics and reporting</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
