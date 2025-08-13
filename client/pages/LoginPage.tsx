import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, Lock, Eye, EyeOff, UserCheck } from "lucide-react";
import { apiService } from "../lib/api";

type UserRole = "admin" | "kitchen_staff" | "delivery_boy" | "waiter" | "manager" | "customer";

interface LoginData {
  email: string;
  password: string;
}

interface SignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const [signupData, setSignupData] = useState<SignupData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "customer",
  });

  const [errors, setErrors] = useState<any>({});

  const validateLogin = () => {
    const newErrors: any = {};

    if (!loginData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!loginData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignup = () => {
    const newErrors: any = {};

    if (!signupData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!signupData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!signupData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(signupData.phone)) {
      newErrors.phone = "Invalid phone number";
    }

    if (!signupData.password) {
      newErrors.password = "Password is required";
    } else if (signupData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (signupData.password !== signupData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLogin()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await apiService.login(loginData.email, loginData.password);
      
      if (response.success && response.data) {
        // Store token and user info
        apiService.setToken(response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("userRole", response.data.user.role);
        
        // Redirect based on role
        const role = response.data.user.role;
        switch (role) {
          case "super_admin":
            navigate("/super-admin");
            break;
          case "admin":
            navigate("/admin");
            break;
          case "kitchen_staff":
            navigate("/kitchen");
            break;
          case "delivery_boy":
            navigate("/delivery");
            break;
          case "waiter":
          case "manager":
            navigate("/staff");
            break;
          default:
            navigate("/menu");
        }
      } else {
        setErrors({ general: response.message || "Login failed" });
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ general: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignup()) return;

    setLoading(true);
    setErrors({});

    try {
      const userData = {
        name: signupData.name,
        email: signupData.email,
        phone: signupData.phone,
        password: signupData.password,
        role: signupData.role,
      };

      const response = await apiService.register(userData);
      
      if (response.success) {
        alert("Account created successfully! Please login with your credentials.");
        setIsLogin(true);
        setSignupData({
          name: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
          role: "customer",
        });
      } else {
        setErrors({ general: response.message || "Registration failed" });
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErrors({ general: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "👨‍💼";
      case "kitchen_staff":
        return "👨‍🍳";
      case "delivery_boy":
        return "🚚";
      case "waiter":
        return "🧑‍🍳";
      case "manager":
        return "👨‍💻";
      case "customer":
        return "👤";
      default:
        return "👤";
    }
  };

  const getRoleDescription = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "Full access to restaurant management";
      case "kitchen_staff":
        return "Manage orders and kitchen operations";
      case "delivery_boy":
        return "Handle delivery orders and tracking";
      case "waiter":
        return "Take orders and serve customers";
      case "manager":
        return "Supervise restaurant operations";
      case "customer":
        return "Place orders and track status";
      default:
        return "Basic access";
    }
  };

  return (
    <div className="min-h-screen bg-gray flex items-center justify-center py-8">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">SG</span>
          </div>
          <h1 className="text-2xl font-bold text-primary">Spice Garden</h1>
          <p className="text-secondary">Restaurant Management System</p>
        </div>

        {/* Toggle Buttons */}
        <div className="flex bg-muted rounded-lg p-1 mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
              isLogin
                ? "bg-white text-primary shadow-sm"
                : "text-secondary hover:text-primary"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
              !isLogin
                ? "bg-white text-primary shadow-sm"
                : "text-secondary hover:text-primary"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Login Form */}
        {isLogin ? (
          <div className="card">
            <h2 className="text-xl font-semibold text-primary mb-6">
              Welcome Back
            </h2>

            {errors.general && (
              <div className="bg-red bg-opacity-10 border border-red text-red p-3 rounded-lg mb-4">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="form-label flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  className={`form-input ${errors.email ? "border-red" : ""}`}
                  placeholder="Enter your email"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                  disabled={loading}
                />
                {errors.email && (
                  <p className="text-red text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="form-label flex items-center">
                  <Lock className="w-4 h-4 mr-2" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`form-input pr-10 ${errors.password ? "border-red" : ""}`}
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform translate-y-neg-half text-secondary"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h3 className="font-medium text-primary mb-2">
                Demo Credentials:
              </h3>
              <div className="space-y-1 text-sm text-secondary">
                <p>
                  <strong>Super Admin:</strong> superadmin@spicegarden.com / super123
                </p>
                <p>
                  <strong>Admin:</strong> admin@spicegarden.com / admin123
                </p>
                <p>
                  <strong>Kitchen:</strong> kitchen@spicegarden.com / kitchen123
                </p>
                <p>
                  <strong>Delivery:</strong> delivery@spicegarden.com / delivery123
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Signup Form */
          <div className="card">
            <h2 className="text-xl font-semibold text-primary mb-6">
              Create Account
            </h2>

            {errors.general && (
              <div className="bg-red bg-opacity-10 border border-red text-red p-3 rounded-lg mb-4">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="form-label flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  className={`form-input ${errors.name ? "border-red" : ""}`}
                  placeholder="Enter your full name"
                  value={signupData.name}
                  onChange={(e) =>
                    setSignupData({ ...signupData, name: e.target.value })
                  }
                  disabled={loading}
                />
                {errors.name && (
                  <p className="text-red text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="form-label flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  className={`form-input ${errors.email ? "border-red" : ""}`}
                  placeholder="Enter your email"
                  value={signupData.email}
                  onChange={(e) =>
                    setSignupData({ ...signupData, email: e.target.value })
                  }
                  disabled={loading}
                />
                {errors.email && (
                  <p className="text-red text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="form-label flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  className={`form-input ${errors.phone ? "border-red" : ""}`}
                  placeholder="Enter 10-digit mobile number"
                  value={signupData.phone}
                  onChange={(e) =>
                    setSignupData({ ...signupData, phone: e.target.value })
                  }
                  disabled={loading}
                />
                {errors.phone && (
                  <p className="text-red text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="form-label flex items-center">
                  <UserCheck className="w-4 h-4 mr-2" />
                  Role
                </label>
                <select
                  className="form-input"
                  value={signupData.role}
                  onChange={(e) =>
                    setSignupData({
                      ...signupData,
                      role: e.target.value as UserRole,
                    })
                  }
                  disabled={loading}
                >
                  <option value="customer">Customer</option>
                  <option value="waiter">Waiter</option>
                  <option value="kitchen_staff">Kitchen Staff</option>
                  <option value="delivery_boy">Delivery Boy</option>
                  <option value="manager">Manager</option>
                </select>
                <p className="text-xs text-secondary mt-1 flex items-center">
                  <span className="mr-1">{getRoleIcon(signupData.role)}</span>
                  {getRoleDescription(signupData.role)}
                </p>
              </div>

              <div>
                <label className="form-label flex items-center">
                  <Lock className="w-4 h-4 mr-2" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`form-input pr-10 ${errors.password ? "border-red" : ""}`}
                    placeholder="Create a password"
                    value={signupData.password}
                    onChange={(e) =>
                      setSignupData({ ...signupData, password: e.target.value })
                    }
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform translate-y-neg-half text-secondary"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="form-label flex items-center">
                  <Lock className="w-4 h-4 mr-2" />
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className={`form-input pr-10 ${errors.confirmPassword ? "border-red" : ""}`}
                    placeholder="Confirm your password"
                    value={signupData.confirmPassword}
                    onChange={(e) =>
                      setSignupData({
                        ...signupData,
                        confirmPassword: e.target.value,
                      })
                    }
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform translate-y-neg-half text-secondary"
                    disabled={loading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red text-sm mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          </div>
        )}

        {/* Footer Links */}
        <div className="text-center mt-6">
          <p className="text-sm text-secondary">
            Need help?{" "}
            <a href="#" className="text-orange font-medium">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
