import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, UserCheck } from 'lucide-react';

type UserRole = 'admin' | 'kitchen' | 'delivery' | 'staff';

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
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: ''
  });

  const [signupData, setSignupData] = useState<SignupData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'staff'
  });

  const [errors, setErrors] = useState<any>({});

  const validateLogin = () => {
    const newErrors: any = {};
    
    if (!loginData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!loginData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignup = () => {
    const newErrors: any = {};
    
    if (!signupData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!signupData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!signupData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(signupData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }
    
    if (!signupData.password) {
      newErrors.password = 'Password is required';
    } else if (signupData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (signupData.password !== signupData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLogin()) return;

    // Mock authentication - in real app, this would call an API
    console.log('Login attempt:', loginData);
    
    // Simulate login success and redirect based on role
    // For demo, admin credentials: admin@spicegarden.com / admin123
    if (loginData.email === 'admin@spicegarden.com' && loginData.password === 'admin123') {
      localStorage.setItem('userRole', 'admin');
      navigate('/admin');
    } else if (loginData.email === 'kitchen@spicegarden.com' && loginData.password === 'kitchen123') {
      localStorage.setItem('userRole', 'kitchen');
      navigate('/kitchen');
    } else if (loginData.email === 'delivery@spicegarden.com' && loginData.password === 'delivery123') {
      localStorage.setItem('userRole', 'delivery');
      navigate('/delivery');
    } else if (loginData.email === 'staff@spicegarden.com' && loginData.password === 'staff123') {
      localStorage.setItem('userRole', 'staff');
      navigate('/staff');
    } else {
      setErrors({ general: 'Invalid email or password' });
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignup()) return;

    // Mock registration - in real app, this would call an API
    console.log('Signup attempt:', signupData);
    
    // Simulate successful registration
    alert('Account created successfully! Please login with your credentials.');
    setIsLogin(true);
    setSignupData({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      role: 'staff'
    });
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin': return '👨‍💼';
      case 'kitchen': return '👨‍🍳';
      case 'delivery': return '🚚';
      case 'staff': return '👨‍💻';
    }
  };

  const getRoleDescription = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'Full access to all features';
      case 'kitchen': return 'Manage orders and kitchen operations';
      case 'delivery': return 'Handle delivery orders and tracking';
      case 'staff': return 'Menu and category management';
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
                ? 'bg-white text-primary shadow-sm' 
                : 'text-secondary hover:text-primary'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
              !isLogin 
                ? 'bg-white text-primary shadow-sm' 
                : 'text-secondary hover:text-primary'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Login Form */}
        {isLogin ? (
          <div className="card">
            <h2 className="text-xl font-semibold text-primary mb-6">Welcome Back</h2>
            
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
                  className={`form-input ${errors.email ? 'border-red' : ''}`}
                  placeholder="Enter your email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                />
                {errors.email && <p className="text-red text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="form-label flex items-center">
                  <Lock className="w-4 h-4 mr-2" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={`form-input pr-10 ${errors.password ? 'border-red' : ''}`}
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform translate-y-neg-half text-secondary"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red text-sm mt-1">{errors.password}</p>}
              </div>

              <button type="submit" className="btn btn-primary w-full">
                Sign In
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h3 className="font-medium text-primary mb-2">Demo Credentials:</h3>
              <div className="space-y-1 text-sm text-secondary">
                <p><strong>Admin:</strong> admin@spicegarden.com / admin123</p>
                <p><strong>Kitchen:</strong> kitchen@spicegarden.com / kitchen123</p>
                <p><strong>Delivery:</strong> delivery@spicegarden.com / delivery123</p>
                <p><strong>General Staff:</strong> staff@spicegarden.com / staff123</p>
              </div>
            </div>
          </div>
        ) : (
          /* Signup Form */
          <div className="card">
            <h2 className="text-xl font-semibold text-primary mb-6">Create Account</h2>
            
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="form-label flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  className={`form-input ${errors.name ? 'border-red' : ''}`}
                  placeholder="Enter your full name"
                  value={signupData.name}
                  onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                />
                {errors.name && <p className="text-red text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="form-label flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  className={`form-input ${errors.email ? 'border-red' : ''}`}
                  placeholder="Enter your email"
                  value={signupData.email}
                  onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                />
                {errors.email && <p className="text-red text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="form-label flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  className={`form-input ${errors.phone ? 'border-red' : ''}`}
                  placeholder="Enter 10-digit mobile number"
                  value={signupData.phone}
                  onChange={(e) => setSignupData({...signupData, phone: e.target.value})}
                />
                {errors.phone && <p className="text-red text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="form-label flex items-center">
                  <UserCheck className="w-4 h-4 mr-2" />
                  Role
                </label>
                <select
                  className="form-input"
                  value={signupData.role}
                  onChange={(e) => setSignupData({...signupData, role: e.target.value as UserRole})}
                >
                  <option value="staff">General Staff</option>
                  <option value="kitchen">Kitchen Staff</option>
                  <option value="delivery">Delivery Boy</option>
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
                    type={showPassword ? 'text' : 'password'}
                    className={`form-input pr-10 ${errors.password ? 'border-red' : ''}`}
                    placeholder="Create a password"
                    value={signupData.password}
                    onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform translate-y-neg-half text-secondary"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red text-sm mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="form-label flex items-center">
                  <Lock className="w-4 h-4 mr-2" />
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className={`form-input pr-10 ${errors.confirmPassword ? 'border-red' : ''}`}
                    placeholder="Confirm your password"
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform translate-y-neg-half text-secondary"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red text-sm mt-1">{errors.confirmPassword}</p>}
              </div>

              <button type="submit" className="btn btn-primary w-full">
                Create Account
              </button>
            </form>
          </div>
        )}

        {/* Footer Links */}
        <div className="text-center mt-6">
          <p className="text-sm text-secondary">
            Need help? <a href="#" className="text-orange font-medium">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
}
