import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useRestaurant, MenuItem, Category } from '@/context/RestaurantContext';
import { ShoppingCart, Plus, Minus, Star, Clock } from 'lucide-react';
import { useCartItemCount } from '@/context/RestaurantContext';
import ItemDetailsModal from '@/components/ItemDetailsModal';

// Mock data - In real app, this would come from API
const mockRestaurantData = {
  restaurant: {
    id: 1,
    name: "Spice Garden",
    logo_url: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=100&h=100&fit=crop&crop=center",
    address: "123 Main Street, Food District"
  },
  categories: [
    {
      id: 1,
      name: "Starters",
      items: [
        {
          id: 1,
          name: "Crispy Paneer Tikka",
          description: "Marinated cottage cheese grilled to perfection with spices",
          price: 220,
          image_url: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop",
          category_id: 1
        },
        {
          id: 2,
          name: "Chicken Wings",
          description: "Spicy buffalo wings served with mint chutney",
          price: 280,
          image_url: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&h=300&fit=crop",
          category_id: 1
        },
        {
          id: 3,
          name: "Vegetable Spring Rolls",
          description: "Fresh vegetables wrapped in crispy pastry",
          price: 180,
          image_url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop",
          category_id: 1
        }
      ]
    },
    {
      id: 2,
      name: "Main Course",
      items: [
        {
          id: 4,
          name: "Butter Chicken",
          description: "Tender chicken in rich tomato and butter gravy",
          price: 380,
          image_url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop",
          category_id: 2
        },
        {
          id: 5,
          name: "Paneer Makhani",
          description: "Cottage cheese cubes in creamy tomato curry",
          price: 320,
          image_url: "https://images.unsplash.com/photo-1631452180539-96aca7d48617?w=400&h=300&fit=crop",
          category_id: 2
        },
        {
          id: 6,
          name: "Biryani Special",
          description: "Aromatic basmati rice with tender meat and spices",
          price: 450,
          image_url: "https://images.unsplash.com/photo-1563379091339-03246963d96a?w=400&h=300&fit=crop",
          category_id: 2
        }
      ]
    },
    {
      id: 3,
      name: "Drinks",
      items: [
        {
          id: 7,
          name: "Mango Lassi",
          description: "Creamy yogurt drink with fresh mango",
          price: 120,
          image_url: "https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=400&h=300&fit=crop",
          category_id: 3
        },
        {
          id: 8,
          name: "Fresh Lime Water",
          description: "Refreshing lime water with mint",
          price: 80,
          image_url: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=300&fit=crop",
          category_id: 3
        }
      ]
    },
    {
      id: 4,
      name: "Desserts",
      items: [
        {
          id: 9,
          name: "Gulab Jamun",
          description: "Soft milk dumplings in sugar syrup",
          price: 150,
          image_url: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop",
          category_id: 4
        },
        {
          id: 10,
          name: "Kulfi",
          description: "Traditional Indian ice cream with cardamom",
          price: 120,
          image_url: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&h=300&fit=crop",
          category_id: 4
        }
      ]
    }
  ]
};

export default function MenuPage() {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const { state, dispatch } = useRestaurant();
  const cartItemCount = useCartItemCount();
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openItemModal = (item: MenuItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeItemModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  useEffect(() => {
    // In real app, fetch data from API using restaurantId
    dispatch({ type: 'SET_LOADING', payload: true });
    
    // Simulate API call
    setTimeout(() => {
      dispatch({
        type: 'SET_RESTAURANT_DATA',
        payload: mockRestaurantData
      });
    }, 1000);
  }, [restaurantId, dispatch]);

  const handleAddToCart = (item: MenuItem) => {
    dispatch({ type: 'ADD_TO_CART', payload: item });
  };

  const getItemCartQuantity = (itemId: number) => {
    const cartItem = state.cart.find(item => item.id === itemId);
    return cartItem?.quantity || 0;
  };

  const updateCartQuantity = (itemId: number, quantity: number) => {
    dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { id: itemId, quantity } });
  };

  const selectedCategory = state.categories.find(cat => cat.id === state.selectedCategory);
  const filteredItems = selectedCategory?.items || [];

  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error: {state.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Restaurant Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <img 
              src={state.restaurant?.logo_url} 
              alt={state.restaurant?.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{state.restaurant?.name}</h1>
              <p className="text-sm text-gray-600 mt-1">{state.restaurant?.address}</p>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <Star className="w-4 h-4 text-yellow-400 mr-1" />
                <span className="mr-3">4.5</span>
                <Clock className="w-4 h-4 mr-1" />
                <span>25-30 min</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-md mx-auto">
          <div className="flex overflow-x-auto scrollbar-hide">
            {state.categories.map((category) => (
              <button
                key={category.id}
                onClick={() => dispatch({ type: 'SET_SELECTED_CATEGORY', payload: category.id })}
                className={`px-6 py-4 whitespace-nowrap text-sm font-medium border-b-2 transition-colors ${
                  state.selectedCategory === category.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="max-w-md mx-auto px-4 py-6 pb-24">
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const cartQuantity = getItemCartQuantity(item.id);
            return (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border p-4">
                <div className="flex space-x-4">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0 cursor-pointer"
                    onClick={() => openItemModal(item)}
                  />
                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-semibold text-gray-900 text-lg cursor-pointer hover:text-orange-600 transition-colors"
                      onClick={() => openItemModal(item)}
                    >
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-lg font-bold text-gray-900">₹{item.price}</span>
                      {cartQuantity > 0 ? (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateCartQuantity(item.id, cartQuantity - 1)}
                            className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center hover:bg-orange-200 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-semibold text-gray-900 w-8 text-center">{cartQuantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.id, cartQuantity + 1)}
                            className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="px-6 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center space-x-1"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Cart Button */}
      {cartItemCount > 0 && (
        <Link
          to="/cart"
          className="fixed bottom-6 right-6 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-colors z-20"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {cartItemCount}
          </span>
        </Link>
      )}

      {/* Item Details Modal */}
      <ItemDetailsModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={closeItemModal}
      />
    </div>
  );
}
