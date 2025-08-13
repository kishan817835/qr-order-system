import { useState, useEffect } from "react";
import { apiService } from "@/lib/api";

export default function APITestPage() {
  const [testResults, setTestResults] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    const results: any = {};

    // Test 1: Health Check
    try {
      const response = await fetch("/api/health");
      const data = await response.json();
      results.health = { success: true, data };
    } catch (error) {
      results.health = { success: false, error: error.message };
    }

    // Test 2: API Service Login
    try {
      const loginResponse = await apiService.login(
        "admin@spicegarden.com",
        "admin123",
      );
      results.login = loginResponse;
    } catch (error) {
      results.login = { success: false, error: error.message };
    }

    // Test 3: Get Restaurant Data
    try {
      const restaurantResponse = await apiService.getRestaurant("1");
      results.restaurant = restaurantResponse;
    } catch (error) {
      results.restaurant = { success: false, error: error.message };
    }

    // Test 4: Get Menu Items
    try {
      const menuResponse = await apiService.getRestaurantMenu("1");
      results.menu = menuResponse;
    } catch (error) {
      results.menu = { success: false, error: error.message };
    }

    setTestResults(results);
    setLoading(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">API Connection Test</h1>

      <button
        onClick={runTests}
        disabled={loading}
        className="btn btn-primary mb-6"
      >
        {loading ? "Running Tests..." : "Run Tests Again"}
      </button>

      <div className="space-y-4">
        {Object.entries(testResults).map(([test, result]: [string, any]) => (
          <div key={test} className="card">
            <h3 className="font-semibold text-lg mb-2 capitalize">
              {test} Test
            </h3>
            <div
              className={`p-3 rounded ${result.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
            >
              <p className="font-medium">
                Status: {result.success ? "✅ Success" : "❌ Failed"}
              </p>
              {result.error && (
                <p className="text-sm mt-1">Error: {result.error}</p>
              )}
              {result.data && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm">
                    View Data
                  </summary>
                  <pre className="text-xs mt-2 overflow-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-100 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Backend Status</h3>
        <p className="text-blue-800 text-sm">
          The backend server should be running on port 5000. The frontend proxy
          is configured to forward /api requests to the backend.
        </p>
        <p className="text-blue-800 text-sm mt-2">
          If tests are failing, ensure the backend server is running with:{" "}
          <code>cd backend && npm start</code>
        </p>
      </div>
    </div>
  );
}
