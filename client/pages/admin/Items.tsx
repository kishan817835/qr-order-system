import { useState } from 'react';
import { Plus, Edit, Trash2, Image, DollarSign, Star, Filter } from 'lucide-react';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  discount?: number;
  isPriority?: boolean;
  isAvailable: boolean;
}

export default function Items() {
  const [items, setItems] = useState<MenuItem[]>([
    {
      id: 1,
      name: 'Crispy Paneer Tikka',
      description: 'Marinated cottage cheese grilled to perfection with spices',
      price: 220,
      image_url: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop',
      category: 'Starters',
      discount: 10,
      isPriority: true,
      isAvailable: true
    },
    {
      id: 2,
      name: 'Butter Chicken',
      description: 'Tender chicken in rich tomato and butter gravy',
      price: 380,
      image_url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop',
      category: 'Main Course',
      isPriority: true,
      isAvailable: true
    },
    {
      id: 3,
      name: 'Mango Lassi',
      description: 'Creamy yogurt drink with fresh mango',
      price: 120,
      image_url: 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=400&h=300&fit=crop',
      category: 'Drinks',
      isAvailable: false
    }
  ]);

  const [filterCategory, setFilterCategory] = useState('all');
  const [showPriorityOnly, setShowPriorityOnly] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const categories = ['Starters', 'Main Course', 'Drinks', 'Desserts'];

  const filteredItems = items.filter(item => {
    const categoryMatch = filterCategory === 'all' || item.category === filterCategory;
    const priorityMatch = !showPriorityOnly || item.isPriority;
    return categoryMatch && priorityMatch;
  });

  const toggleItemAvailability = (id: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
    ));
  };

  const togglePriority = (id: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, isPriority: !item.isPriority } : item
    ));
  };

  const deleteItem = (id: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Menu Items</h1>
          <p className="text-secondary">Manage your restaurant menu items</p>
        </div>
        <button 
          onClick={() => setIsAddingNew(true)}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="form-label">Filter by Category</label>
            <select 
              className="form-input"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showPriorityOnly}
                onChange={(e) => setShowPriorityOnly(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm font-medium text-primary">Priority Items Only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredItems.map((item) => (
          <div key={item.id} className={`card ${!item.isAvailable ? 'opacity-50' : ''}`}>
            <div className="relative mb-4">
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-32 object-cover rounded-lg"
              />
              {item.discount && (
                <div className="absolute top-2 left-2 bg-orange text-white px-2 py-1 rounded-full text-xs font-bold">
                  {item.discount}% OFF
                </div>
              )}
              {item.isPriority && (
                <div className="absolute top-2 right-2 bg-orange text-white w-6 h-6 rounded-full flex items-center justify-center">
                  <Star className="w-3 h-3" />
                </div>
              )}
              <div className="absolute bottom-2 right-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.isAvailable 
                    ? 'bg-green text-white' 
                    : 'bg-red text-white'
                }`}>
                  {item.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-primary">{item.name}</h3>
                <span className="font-bold text-orange">₹{item.price}</span>
              </div>
              
              <p className="text-sm text-secondary line-clamp-2">{item.description}</p>
              
              <div className="flex items-center justify-between text-xs">
                <span className="badge badge-orange">{item.category}</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => togglePriority(item.id)}
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      item.isPriority ? 'bg-orange text-white' : 'bg-muted text-secondary'
                    }`}
                    title="Toggle Priority"
                  >
                    <Star className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => toggleItemAvailability(item.id)}
                className={`btn btn-sm flex-1 ${
                  item.isAvailable ? 'btn-secondary' : 'btn-primary'
                }`}
              >
                {item.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
              </button>
              <button className="btn btn-secondary btn-sm">
                <Edit className="w-4 h-4" />
              </button>
              <button 
                onClick={() => deleteItem(item.id)}
                className="btn btn-sm w-10 h-10 bg-red text-white hover:bg-red"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Image className="w-12 h-12 text-secondary" />
          </div>
          <h3 className="text-lg font-semibold text-primary mb-2">
            {items.length === 0 ? 'No Items Yet' : 'No Items Found'}
          </h3>
          <p className="text-secondary mb-4">
            {items.length === 0 
              ? 'Add your first menu item to get started'
              : 'Try adjusting your filters to see more items'
            }
          </p>
          {items.length === 0 && (
            <button 
              onClick={() => setIsAddingNew(true)}
              className="btn btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Item
            </button>
          )}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary">{items.length}</div>
          <div className="text-sm text-secondary">Total Items</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green">{items.filter(i => i.isAvailable).length}</div>
          <div className="text-sm text-secondary">Available</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-orange">{items.filter(i => i.isPriority).length}</div>
          <div className="text-sm text-secondary">Priority Items</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary">{items.filter(i => i.discount).length}</div>
          <div className="text-sm text-secondary">With Discount</div>
        </div>
      </div>
    </div>
  );
}
