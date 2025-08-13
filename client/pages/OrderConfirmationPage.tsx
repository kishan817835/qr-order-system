import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useRestaurant } from '@/context/RestaurantContext';
import { CheckCircle, Clock, ShoppingBag, CreditCard, MapPin } from 'lucide-react';

export default function OrderConfirmationPage() {
  const { state, dispatch } = useRestaurant();
  const location = useLocation();

  // Get order details from location state (for delivery/takeaway) or generate for dining
  const orderData = location.state || {};
  const orderId = orderData.orderId || Math.floor(Math.random() * 10000) + 1000;
  const estimatedTime = Math.floor(Math.random() * 15) + 20; // 20-35 minutes
  const isDining = state.serviceType === 'dining';

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
        <div className="card mb-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-primary mb-2">Order #{orderId}</h2>
            <div className="flex items-center justify-center text-orange mb-4">
              <Clock className="w-5 h-5 mr-2" />
              <span className="font-medium">Estimated time: {estimatedTime} minutes</span>
            </div>
            {isDining && state.tableNumber && (
              <div className="bg-orange-light p-3 rounded-lg mb-4">
                <p className="font-medium text-orange">Table #{state.tableNumber}</p>
                <p className="text-sm text-secondary">Please remain seated, we'll serve you</p>
              </div>
            )}
            <p className="text-secondary">
              We're preparing your delicious meal. You'll receive updates about your order status.
            </p>
          </div>
        </div>

        {/* Customer Details (for delivery/takeaway) */}
        {orderData.customerDetails && (
          <div className="card mb-6">
            <h3 className="font-semibold text-primary mb-3">Order Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary">Customer:</span>
                <span className="text-primary font-medium">{orderData.customerDetails.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Phone:</span>
                <span className="text-primary">{orderData.customerDetails.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Email:</span>
                <span className="text-primary">{orderData.customerDetails.email}</span>
              </div>
              {orderData.customerDetails.address && (
                <div className="pt-2 border-t">
                  <p className="text-secondary text-xs mb-1">Delivery Address:</p>
                  <p className="text-primary">{orderData.customerDetails.address}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Payment Method */}
        {orderData.paymentMethod && (
          <div className="card mb-6">
            <h3 className="font-semibold text-primary mb-3">Payment Method</h3>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange rounded-full flex items-center justify-center">
                {orderData.paymentMethod === 'cod' ? '💵' : '💳'}
              </div>
              <span className="text-primary">
                {orderData.paymentMethod === 'cod'
                  ? `Cash on ${state.serviceType === 'delivery' ? 'Delivery' : 'Pickup'}`
                  : 'Paid Online'
                }
              </span>
            </div>
          </div>
        )}

        {/* Pay on Table (for dining) */}
        {isDining && (
          <div className="card mb-6">
            <h3 className="font-semibold text-primary mb-3">Payment</h3>
            <div className="bg-orange-light p-4 rounded-lg text-center">
              <CreditCard className="w-8 h-8 text-orange mx-auto mb-2" />
              <p className="font-medium text-orange">Pay on Table</p>
              <p className="text-sm text-secondary mt-1">
                You can pay after your meal using cash or card
              </p>
            </div>
          </div>
        )}

        {/* Restaurant Info */}
        {state.restaurant && (
          <div className="card mb-6">
            <div className="flex items-center space-x-3">
              <img
                src={state.restaurant.logo_url}
                alt={state.restaurant.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-primary">{state.restaurant.name}</h3>
                <p className="text-sm text-secondary">{state.restaurant.address}</p>
              </div>
            </div>
          </div>
        )}

        {/* Order Status Steps */}
        <div className="card mb-6">
          <h3 className="font-semibold text-primary mb-4">Order Status</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-medium text-primary">Order Placed</p>
                <p className="text-sm text-secondary">Your order has been confirmed</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-orange rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-medium text-primary">Preparing</p>
                <p className="text-sm text-secondary">Kitchen is preparing your order</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-secondary" />
              </div>
              <div>
                <p className="font-medium text-muted">
                  {isDining ? 'Ready to Serve' : state.serviceType === 'delivery' ? 'Out for Delivery' : 'Ready for Pickup'}
                </p>
                <p className="text-sm text-muted">We'll notify you when ready</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button className="btn btn-primary w-full">
            Track Order
          </button>
          <Link
            to={`/menu/${state.restaurant?.id || 1}`}
            className="btn btn-secondary w-full text-center"
          >
            Order Again
          </Link>
        </div>

        {/* Contact Info */}
        <div className="mt-8 text-center text-sm text-secondary">
          <p>Need help? Contact restaurant directly</p>
          <p className="font-medium text-orange mt-1">+91 12345 67890</p>
        </div>
      </div>
    </div>
  );
}
