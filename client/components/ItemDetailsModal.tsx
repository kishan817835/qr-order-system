import { useState } from "react";
import { X, Minus, Plus } from "lucide-react";
import { MenuItem, useRestaurant } from "@/context/RestaurantContext";

interface ItemDetailsModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ItemDetailsModal({
  item,
  isOpen,
  onClose,
}: ItemDetailsModalProps) {
  const { state, dispatch } = useRestaurant();
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !item) return null;

  const cartItem = state.cart.find((cartItem) => cartItem.id === item.id);
  const currentCartQuantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch({ type: "ADD_TO_CART", payload: item });
    }
    onClose();
    setQuantity(1);
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content rounded-t-3xl w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative">
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-64 object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg"
          >
            <X className="w-5 h-5 text-secondary" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-primary mb-2">{item.name}</h2>
          <p className="text-secondary mb-4 leading-relaxed">
            {item.description}
          </p>

          {/* Price */}
          <div className="mb-6">
            <span className="text-2xl font-bold text-primary">
              ₹{item.price}
            </span>
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <p className="text-sm font-medium text-primary mb-3">Quantity</p>
            <div className="flex items-center space-x-4">
              <button
                onClick={decrementQuantity}
                className="w-12 h-12 rounded-full bg-muted text-secondary flex items-center justify-center hover:bg-border transition"
                disabled={quantity <= 1}
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="text-xl font-semibold text-primary w-8 text-center">
                {quantity}
              </span>
              <button
                onClick={incrementQuantity}
                className="w-12 h-12 rounded-full bg-orange-light text-orange flex items-center justify-center hover:bg-orange transition"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="btn btn-primary btn-lg w-full"
          >
            <span>
              Add {quantity} to Cart • ₹{item.price * quantity}
            </span>
          </button>

          {/* Current Cart Info */}
          {currentCartQuantity > 0 && (
            <p className="text-center text-sm text-secondary mt-3">
              {currentCartQuantity} already in cart
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
