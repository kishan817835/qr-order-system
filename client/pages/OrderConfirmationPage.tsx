import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRestaurant } from '@/context/RestaurantContext';
import { CheckCircle, Clock, ShoppingBag } from 'lucide-react';

export default function OrderConfirmationPage() {
  const { state, dispatch } = useRestaurant();
  
  // Generate a random order ID for demo
  const orderId = Math.floor(Math.random() * 10000) + 1000;
  const estimatedTime = Math.floor(Math.random() * 15) + 20; // 20-35 minutes

  useEffect(() => {
    // Clear cart after order is placed
    dispatch({ type: 'CLEAR_CART' });
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">Your order has been placed successfully</p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Order #{orderId}</h2>
            <div className="flex items-center justify-center text-orange-600 mb-4">
              <Clock className="w-5 h-5 mr-2" />
              <span className="font-medium">Estimated time: {estimatedTime} minutes</span>
            </div>
            <p className="text-gray-600">
              We're preparing your delicious meal. You'll receive updates about your order status.
            </p>
          </div>
        </div>

        {/* Restaurant Info */}
        {state.restaurant && (
          <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
            <div className="flex items-center space-x-3">
              <img 
                src={state.restaurant.logo_url} 
                alt={state.restaurant.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{state.restaurant.name}</h3>
                <p className="text-sm text-gray-600">{state.restaurant.address}</p>
              </div>
            </div>
          </div>
        )}

        {/* Order Status Steps */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Order Status</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Order Placed</p>
                <p className="text-sm text-gray-600">Your order has been confirmed</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Preparing</p>
                <p className="text-sm text-gray-600">Kitchen is preparing your order</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-gray-500">Ready for Pickup</p>
                <p className="text-sm text-gray-500">We'll notify you when ready</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button className="w-full py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors">
            Track Order
          </button>
          <Link 
            to={`/menu/${state.restaurant?.id || 1}`}
            className="block w-full py-3 bg-gray-100 text-gray-700 text-center rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Order Again
          </Link>
        </div>

        {/* Contact Info */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Need help? Contact restaurant directly</p>
          <p className="font-medium text-orange-600 mt-1">+91 12345 67890</p>
        </div>
      </div>
    </div>
  );
}
