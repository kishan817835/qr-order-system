import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useRestaurant, MenuItem, Category, ServiceType } from '@/context/RestaurantContext';
import { ShoppingCart, Plus, Minus, Search, Clock, MapPin, Phone, ArrowRight, X } from 'lucide-react';
import { useCartItemCount } from '@/context/RestaurantContext';
import ItemDetailsModal from '@/components/ItemDetailsModal';

// Enhanced mock data with new features
const mockRestaurantData = {
  restaurant: {
    id: 1,
    name: "Spice Garden",
    logo_url: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=100&h=100&fit=crop&crop=center",
    address: "123 Main Street, Food District",
    banner_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=300&fit=crop"
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
          category_id: 1,
          discount: 10,
          isPriority: true
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
          category_id: 1,
          discount: 15
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
          category_id: 2,
          isPriority: true
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
          category_id: 2,
          discount: 20
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
          category_id: 4,
          isPriority: true
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

  useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    // Get table number from URL params if available
    const urlParams = new URLSearchParams(window.location.search);
    const tableNumber = urlParams.get('table');
    if (tableNumber) {
      dispatch({ type: 'SET_TABLE_NUMBER', payload: tableNumber });
    }
    
    // Simulate API call
    setTimeout(() => {
      const priorityItems = mockRestaurantData.categories
        .flatMap(cat => cat.items)
        .filter(item => item.isPriority);
      
      dispatch({
        type: 'SET_RESTAURANT_DATA',
        payload: {
          restaurant: mockRestaurantData.restaurant,
          categories: mockRestaurantData.categories,
          priorityItems
        }
      });
    }, 1000);
  }, [restaurantId, dispatch]);

  const openItemModal = (item: MenuItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeItemModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

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

  const handleServiceTypeChange = (serviceType: ServiceType) => {
    dispatch({ type: 'SET_SERVICE_TYPE', payload: serviceType });
  };

  const selectedCategory = state.categories.find(cat => cat.id === state.selectedCategory);

  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-gray flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-secondary">Loading menu...</p>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen bg-gray flex items-center justify-center">
        <div className="text-center">
          <p className="text-red">Error: {state.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray">
      {/* Navbar */}
      <div className="bg-white shadow border-b sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src={state.restaurant?.logo_url} 
                alt={state.restaurant?.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h1 className="text-lg font-bold text-primary">{state.restaurant?.name}</h1>
                {state.tableNumber && (
                  <p className="text-sm text-orange">Table #{state.tableNumber}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-secondary">
              <Star className="w-4 h-4 text-warning" />
              <span>4.5</span>
              <Clock className="w-4 h-4 ml-2" />
              <span>25-30 min</span>
            </div>
          </div>
        </div>
      </div>

      {/* Service Type Selection */}
      <div className="bg-white border-b">
        <div className="container py-4">
          <h2 className="text-base font-semibold text-primary mb-3">Choose Service Type</h2>
          <div className="flex space-x-3">
            <button
              onClick={() => handleServiceTypeChange('dining')}
              className={`service-option ${state.serviceType === 'dining' ? 'active' : ''}`}
            >
              <div className="w-8 h-8 bg-orange rounded-full flex items-center justify-center mb-2">
                <span className="text-white text-sm">🍽️</span>
              </div>
              <span className="text-sm font-medium">Dining</span>
            </button>
            <button
              onClick={() => handleServiceTypeChange('takeaway')}
              className={`service-option ${state.serviceType === 'takeaway' ? 'active' : ''}`}
            >
              <div className="w-8 h-8 bg-orange rounded-full flex items-center justify-center mb-2">
                <span className="text-white text-sm">🥡</span>
              </div>
              <span className="text-sm font-medium">Takeaway</span>
            </button>
            <button
              onClick={() => handleServiceTypeChange('delivery')}
              className={`service-option ${state.serviceType === 'delivery' ? 'active' : ''}`}
            >
              <div className="w-8 h-8 bg-orange rounded-full flex items-center justify-center mb-2">
                <span className="text-white text-sm">🚚</span>
              </div>
              <span className="text-sm font-medium">Delivery</span>
            </button>
          </div>
        </div>
      </div>

      {/* Banner */}
      {state.restaurant?.banner_url && (
        <div className="relative">
          <img 
            src={state.restaurant.banner_url}
            alt="Restaurant banner"
            className="w-full h-32 object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-xl font-bold">Fresh Food Daily</h2>
              <p className="text-sm">Made with love and finest ingredients</p>
            </div>
          </div>
        </div>
      )}

      {/* Priority Items */}
      {state.priorityItems.length > 0 && (
        <div className="container py-6">
          <div className="priority-section">
            <h2 className="text-lg font-bold text-primary mb-4">⭐ Chef's Special</h2>
            <div className="space-y-3">
              {state.priorityItems.slice(0, 2).map((item) => {
                const cartQuantity = getItemCartQuantity(item.id);
                return (
                  <div key={item.id} className="bg-white rounded-lg shadow p-4">
                    <div className="flex space-x-4">
                      <img 
                        src={item.image_url}
                        alt={item.name}
                        className="w-20 h-20 rounded-lg object-cover cursor-pointer"
                        onClick={() => openItemModal(item)}
                      />
                      <div className="flex-1">
                        <h3 
                          className="font-semibold text-primary text-lg cursor-pointer"
                          onClick={() => openItemModal(item)}
                        >
                          {item.name}
                        </h3>
                        <p className="text-sm text-secondary mt-1 line-clamp-2">{item.description}</p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-primary">₹{item.price}</span>
                            {item.discount && (
                              <span className="badge badge-orange">{item.discount}% OFF</span>
                            )}
                          </div>
                          {cartQuantity > 0 ? (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateCartQuantity(item.id, cartQuantity - 1)}
                                className="w-8 h-8 rounded-full bg-orange-light text-orange flex items-center justify-center"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="font-semibold text-primary w-8 text-center">{cartQuantity}</span>
                              <button
                                onClick={() => updateCartQuantity(item.id, cartQuantity + 1)}
                                className="w-8 h-8 rounded-full bg-orange text-white flex items-center justify-center"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleAddToCart(item)}
                              className="btn btn-primary btn-sm"
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Add
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
        </div>
      )}

      {/* Categories */}
      <div className="container py-6">
        <h2 className="text-lg font-bold text-primary mb-4">Menu Categories</h2>
        <div className="category-scroll">
          {state.categories.map((category) => (
            <div
              key={category.id}
              className="category-card"
              onClick={() => dispatch({ type: 'SET_SELECTED_CATEGORY', payload: category.id })}
            >
              <h3 className="font-semibold text-primary mb-2">{category.name}</h3>
              <p className="text-sm text-secondary">{category.items.length} items</p>
              {category.items[0] && (
                <img 
                  src={category.items[0].image_url}
                  alt={category.name}
                  className="w-full h-20 object-cover rounded mt-3"
                />
              )}
              <div className="flex items-center justify-between mt-3">
                <span className="text-sm text-orange font-medium">View All</span>
                <ArrowRight className="w-4 h-4 text-orange" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Category Items */}
      {selectedCategory && (
        <div className="container pb-24">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-primary">{selectedCategory.name}</h2>
            <span className="text-sm text-secondary">{selectedCategory.items.length} items</span>
          </div>
          <div className="space-y-4">
            {selectedCategory.items.map((item) => {
              const cartQuantity = getItemCartQuantity(item.id);
              return (
                <div key={item.id} className="card">
                  <div className="flex space-x-4">
                    <img 
                      src={item.image_url}
                      alt={item.name}
                      className="w-20 h-20 rounded-lg object-cover cursor-pointer"
                      onClick={() => openItemModal(item)}
                    />
                    <div className="flex-1">
                      <h3 
                        className="font-semibold text-primary text-lg cursor-pointer"
                        onClick={() => openItemModal(item)}
                      >
                        {item.name}
                      </h3>
                      <p className="text-sm text-secondary mt-1 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-primary">₹{item.price}</span>
                          {item.discount && (
                            <span className="badge badge-orange">{item.discount}% OFF</span>
                          )}
                        </div>
                        {cartQuantity > 0 ? (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateCartQuantity(item.id, cartQuantity - 1)}
                              className="w-8 h-8 rounded-full bg-orange-light text-orange flex items-center justify-center"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="font-semibold text-primary w-8 text-center">{cartQuantity}</span>
                            <button
                              onClick={() => updateCartQuantity(item.id, cartQuantity + 1)}
                              className="w-8 h-8 rounded-full bg-orange text-white flex items-center justify-center"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="btn btn-primary btn-sm"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add
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
      )}

      {/* Floating Cart Button */}
      {cartItemCount > 0 && (
        <Link
          to="/cart"
          className="fixed bottom-6 right-6 bg-orange text-white p-4 rounded-full shadow-lg z-20 transition"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute -top-2 -right-2 bg-red text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
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
