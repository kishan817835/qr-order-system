import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useRestaurant,
  useCartTotal,
  useCartItemCount,
} from "@/context/RestaurantContext";
import {
  ArrowLeft,
  CreditCard,
  Truck,
  MapPin,
  Phone,
  User,
  Mail,
} from "lucide-react";
import Footer from "@/components/Footer";

interface CustomerForm {
  name: string;
  email: string;
  phone: string;
  alternatePhone: string;
  address: string;
}

export default function PaymentPage() {
  const { state } = useRestaurant();
  const total = useCartTotal();
  const itemCount = useCartItemCount();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState<"cod" | "gateway" | null>(
    null,
  );
  const [showForm, setShowForm] = useState(false);
  const [customerForm, setCustomerForm] = useState<CustomerForm>({
    name: "",
    email: "",
    phone: "",
    alternatePhone: "",
    address: "",
  });
  const [errors, setErrors] = useState<Partial<CustomerForm>>({});

  const isDelivery = state.serviceType === "delivery";
  const isTakeaway = state.serviceType === "takeaway";

  const handlePaymentMethodSelect = (method: "cod" | "gateway") => {
    setPaymentMethod(method);
    setShowForm(true);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerForm> = {};

    if (!customerForm.name.trim()) newErrors.name = "Name is required";
    if (!customerForm.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerForm.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!customerForm.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(customerForm.phone)) {
      newErrors.phone = "Invalid phone number";
    }

    if (isDelivery && !customerForm.address.trim()) {
      newErrors.address = "Address is required for delivery";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = () => {
    if (!validateForm()) return;

    // Simulate order placement
    navigate("/order/confirmation", {
      state: {
        orderId: Math.floor(Math.random() * 10000) + 1000,
        paymentMethod,
        customerDetails: customerForm,
        serviceType: state.serviceType,
      },
    });
  };

  const calculateTotal = () => {
    const deliveryFee = isDelivery ? 40 : 0;
    const packagingFee = isTakeaway ? 20 : 0;
    const taxes = Math.round(total * 0.1);
    return total + deliveryFee + packagingFee + taxes;
  };

  if (state.cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray flex items-center justify-center">
        <div className="text-center">
          <p className="text-secondary mb-4">Your cart is empty</p>
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
    <div className="min-h-screen bg-gray">
      {/* Header */}
      <div className="bg-white shadow border-b">
        <div className="container py-4 flex items-center">
          <Link to="/cart" className="mr-4">
            <ArrowLeft className="w-6 h-6 text-secondary" />
          </Link>
          <h1 className="text-xl font-semibold text-primary">
            {showForm ? "Order Details" : "Payment Method"}
          </h1>
        </div>
      </div>

      <div className="container py-6 pb-32">
        {!showForm ? (
          <>
            {/* Service Type Info */}
            <div className="card mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-orange rounded-full flex items-center justify-center">
                  {isDelivery ? "🚚" : "🥡"}
                </div>
                <div>
                  <h2 className="font-semibold text-primary capitalize">
                    {state.serviceType}
                  </h2>
                  <p className="text-sm text-secondary">
                    {isDelivery
                      ? "Delivered to your address"
                      : "Pick up from restaurant"}
                  </p>
                </div>
              </div>
              {isDelivery && (
                <div className="bg-orange-light p-3 rounded-lg">
                  <p className="text-sm text-orange font-medium">
                    📍 Please provide accurate delivery address for timely
                    delivery
                  </p>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="card mb-6">
              <h3 className="font-semibold text-primary mb-3">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-secondary">Items ({itemCount})</span>
                  <span className="text-primary">₹{total}</span>
                </div>
                {isDelivery && (
                  <div className="flex justify-between">
                    <span className="text-secondary">Delivery Fee</span>
                    <span className="text-primary">₹40</span>
                  </div>
                )}
                {isTakeaway && (
                  <div className="flex justify-between">
                    <span className="text-secondary">Packaging Fee</span>
                    <span className="text-primary">₹20</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-secondary">Taxes & Fees</span>
                  <span className="text-primary">
                    ₹{Math.round(total * 0.1)}
                  </span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span className="text-primary">Total</span>
                    <span className="text-primary">₹{calculateTotal()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="card">
              <h3 className="font-semibold text-primary mb-4">
                Choose Payment Method
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => handlePaymentMethodSelect("cod")}
                  className="w-full p-4 border-2 border-border rounded-lg hover:border-orange transition text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green rounded-full flex items-center justify-center">
                      <span className="text-white">💵</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-primary">
                        Cash on {isDelivery ? "Delivery" : "Pickup"}
                      </h4>
                      <p className="text-sm text-secondary">
                        Pay when you receive your order
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handlePaymentMethodSelect("gateway")}
                  className="w-full p-4 border-2 border-border rounded-lg hover:border-orange transition text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange rounded-full flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-primary">Pay Online</h4>
                      <p className="text-sm text-secondary">
                        Credit/Debit Card, UPI, Net Banking
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Customer Form */
          <div className="space-y-6">
            <div className="card">
              <h3 className="font-semibold text-primary mb-4">
                Customer Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="form-label flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    className={`form-input ${errors.name ? "border-red" : ""}`}
                    placeholder="Enter your full name"
                    value={customerForm.name}
                    onChange={(e) =>
                      setCustomerForm({ ...customerForm, name: e.target.value })
                    }
                  />
                  {errors.name && (
                    <p className="text-red text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="form-label flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    className={`form-input ${errors.email ? "border-red" : ""}`}
                    placeholder="Enter your email"
                    value={customerForm.email}
                    onChange={(e) =>
                      setCustomerForm({
                        ...customerForm,
                        email: e.target.value,
                      })
                    }
                  />
                  {errors.email && (
                    <p className="text-red text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="form-label flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    className={`form-input ${errors.phone ? "border-red" : ""}`}
                    placeholder="Enter 10-digit mobile number"
                    value={customerForm.phone}
                    onChange={(e) =>
                      setCustomerForm({
                        ...customerForm,
                        phone: e.target.value,
                      })
                    }
                  />
                  {errors.phone && (
                    <p className="text-red text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="form-label flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    Alternate Phone Number
                  </label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="Alternate contact (optional)"
                    value={customerForm.alternatePhone}
                    onChange={(e) =>
                      setCustomerForm({
                        ...customerForm,
                        alternatePhone: e.target.value,
                      })
                    }
                  />
                </div>

                {isDelivery && (
                  <div>
                    <label className="form-label flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Delivery Address *
                    </label>
                    <textarea
                      className={`form-input min-h-20 ${errors.address ? "border-red" : ""}`}
                      placeholder="Enter complete delivery address with landmarks"
                      rows={3}
                      value={customerForm.address}
                      onChange={(e) =>
                        setCustomerForm({
                          ...customerForm,
                          address: e.target.value,
                        })
                      }
                    />
                    {errors.address && (
                      <p className="text-red text-sm mt-1">{errors.address}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Payment Method Selected */}
            <div className="card">
              <h3 className="font-semibold text-primary mb-3">
                Payment Method
              </h3>
              <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <div className="w-8 h-8 bg-orange rounded-full flex items-center justify-center">
                  {paymentMethod === "cod" ? "💵" : "💳"}
                </div>
                <span className="font-medium text-primary">
                  {paymentMethod === "cod"
                    ? `Cash on ${isDelivery ? "Delivery" : "Pickup"}`
                    : "Pay Online"}
                </span>
              </div>
            </div>

            {/* Order Total */}
            <div className="card">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-primary">
                  Total Amount
                </span>
                <span className="text-xl font-bold text-orange">
                  ₹{calculateTotal()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="container">
          {showForm ? (
            <button
              onClick={handleFormSubmit}
              className="btn btn-primary btn-lg w-full"
            >
              {paymentMethod === "cod" ? "Place Order" : "Proceed to Payment"} •
              ₹{calculateTotal()}
            </button>
          ) : (
            <div className="text-center">
              <p className="text-sm text-secondary mb-2">
                Choose a payment method to continue
              </p>
              <div className="text-lg font-bold text-primary">
                Total: ₹{calculateTotal()}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
