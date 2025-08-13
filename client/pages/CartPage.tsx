import { Link, useNavigate } from 'react-router-dom';
import { useRestaurant, useCartTotal, useCartItemCount } from '@/context/RestaurantContext';
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { state, dispatch } = useRestaurant();
  const total = useCartTotal();
  const itemCount = useCartItemCount();
  const navigate = useNavigate();

  const updateQuantity = (itemId: number, quantity: number) => {
    dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { id: itemId, quantity } });
  };

  const removeItem = (itemId: number) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
  };

  const handlePlaceOrder = () => {
    // Navigate to order confirmation
    navigate('/order/confirmation');
  };

  if (state.cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray">
        {/* Header */}
        <div className="bg-white shadow border-b">
          <div className="container py-4 flex items-center">
            <Link to={`/menu/${state.restaurant?.id || 1}`} className="mr-4">
              <ArrowLeft className="w-6 h-6 text-secondary" />
            </Link>
            <h1 className="text-xl font-semibold text-primary">Cart</h1>
          </div>
        </div>

        {/* Empty Cart */}
        <div className="container py-16 text-center">
          <ShoppingBag className="w-16 h-16 text-muted mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-primary mb-2">Your cart is empty</h2>
          <p className="text-secondary mb-6">Add some delicious items from the menu</p>
          <Link
            to={`/menu/${state.restaurant?.id || 1}`}
            className="btn btn-primary"
          >
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center">
          <Link to={`/menu/${state.restaurant?.id || 1}`} className="mr-4">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Link>
          <h1 className="text-xl font-semibold text-gray-900">Cart ({itemCount} items)</h1>
        </div>
      </div>

      {/* Cart Items */}
      <div className="max-w-md mx-auto px-4 py-6 pb-32">
        <div className="space-y-4">
          {state.cart.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border p-4">
              <div className="flex space-x-4">
                <img 
                  src={item.image_url}
                  alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">₹{item.price} each</p>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center hover:bg-orange-200 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-semibold text-gray-900 w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="font-bold text-gray-900">₹{item.price * item.quantity}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl shadow-sm border p-4 mt-6">
          <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₹{total}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Taxes & Fees</span>
              <span>₹{Math.round(total * 0.1)}</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between font-bold text-gray-900 text-lg">
                <span>Total</span>
                <span>₹{total + Math.round(total * 0.1)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Place Order Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="max-w-md mx-auto">
          <button
            onClick={handlePlaceOrder}
            className="w-full py-4 bg-orange-500 text-white rounded-lg font-semibold text-lg hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2"
          >
            <span>Place Order • ₹{total + Math.round(total * 0.1)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
