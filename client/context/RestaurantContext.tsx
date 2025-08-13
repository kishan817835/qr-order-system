import { createContext, useContext, useReducer, ReactNode } from 'react';

// Types
export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: number;
}

export interface Category {
  id: number;
  name: string;
  items: MenuItem[];
}

export interface Restaurant {
  id: number;
  name: string;
  logo_url: string;
  address: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface RestaurantState {
  restaurant: Restaurant | null;
  categories: Category[];
  cart: CartItem[];
  selectedCategory: number | null;
  isLoading: boolean;
  error: string | null;
}

// Actions
type RestaurantAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_RESTAURANT_DATA'; payload: { restaurant: Restaurant; categories: Category[] } }
  | { type: 'SET_SELECTED_CATEGORY'; payload: number }
  | { type: 'ADD_TO_CART'; payload: MenuItem }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' };

// Initial state
const initialState: RestaurantState = {
  restaurant: null,
  categories: [],
  cart: [],
  selectedCategory: null,
  isLoading: false,
  error: null,
};

// Reducer
function restaurantReducer(state: RestaurantState, action: RestaurantAction): RestaurantState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'SET_RESTAURANT_DATA':
      return {
        ...state,
        restaurant: action.payload.restaurant,
        categories: action.payload.categories,
        selectedCategory: action.payload.categories[0]?.id || null,
        isLoading: false,
        error: null,
      };
    
    case 'SET_SELECTED_CATEGORY':
      return { ...state, selectedCategory: action.payload };
    
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      } else {
        return {
          ...state,
          cart: [...state.cart, { ...action.payload, quantity: 1 }],
        };
      }
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload),
      };
    
    case 'UPDATE_CART_QUANTITY':
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          cart: state.cart.filter(item => item.id !== action.payload.id),
        };
      }
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    
    default:
      return state;
  }
}

// Context
const RestaurantContext = createContext<{
  state: RestaurantState;
  dispatch: React.Dispatch<RestaurantAction>;
} | null>(null);

// Provider
export function RestaurantProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(restaurantReducer, initialState);

  return (
    <RestaurantContext.Provider value={{ state, dispatch }}>
      {children}
    </RestaurantContext.Provider>
  );
}

// Hook
export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
}

// Computed values
export function useCartTotal() {
  const { state } = useRestaurant();
  return state.cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

export function useCartItemCount() {
  const { state } = useRestaurant();
  return state.cart.reduce((count, item) => count + item.quantity, 0);
}
