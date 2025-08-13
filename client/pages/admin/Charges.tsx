import { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, DollarSign, Percent } from 'lucide-react';

interface ExtraCharge {
  id: number;
  name: string;
  amount: number;
  type: 'fixed' | 'percentage';
  appliesTo: 'all' | 'delivery' | 'takeaway' | 'dining';
  isActive: boolean;
}

export default function Charges() {
  const [charges, setCharges] = useState<ExtraCharge[]>([
    {
      id: 1,
      name: 'Delivery Fee',
      amount: 40,
      type: 'fixed',
      appliesTo: 'delivery',
      isActive: true
    },
    {
      id: 2,
      name: 'Packaging Fee',
      amount: 20,
      type: 'fixed',
      appliesTo: 'takeaway',
      isActive: true
    },
    {
      id: 3,
      name: 'Service Charge',
      amount: 10,
      type: 'percentage',
      appliesTo: 'all',
      isActive: true
    },
    {
      id: 4,
      name: 'Late Night Surcharge',
      amount: 50,
      type: 'fixed',
      appliesTo: 'all',
      isActive: false
    }
  ]);

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    type: 'fixed' as 'fixed' | 'percentage',
    appliesTo: 'all' as 'all' | 'delivery' | 'takeaway' | 'dining'
  });

  const handleAddNew = () => {
    if (formData.name.trim() && formData.amount) {
      const newCharge: ExtraCharge = {
        id: Math.max(...charges.map(c => c.id)) + 1,
        name: formData.name.trim(),
        amount: parseFloat(formData.amount),
        type: formData.type,
        appliesTo: formData.appliesTo,
        isActive: true
      };
      setCharges([...charges, newCharge]);
      setFormData({ name: '', amount: '', type: 'fixed', appliesTo: 'all' });
      setIsAddingNew(false);
    }
  };

  const handleEdit = (charge: ExtraCharge) => {
    setEditingId(charge.id);
    setFormData({
      name: charge.name,
      amount: charge.amount.toString(),
      type: charge.type,
      appliesTo: charge.appliesTo
    });
  };

  const handleSaveEdit = () => {
    if (formData.name.trim() && formData.amount && editingId) {
      setCharges(charges.map(charge => 
        charge.id === editingId 
          ? {
              ...charge,
              name: formData.name.trim(),
              amount: parseFloat(formData.amount),
              type: formData.type,
              appliesTo: formData.appliesTo
            }
          : charge
      ));
      setEditingId(null);
      setFormData({ name: '', amount: '', type: 'fixed', appliesTo: 'all' });
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', amount: '', type: 'fixed', appliesTo: 'all' });
    setIsAddingNew(false);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this charge?')) {
      setCharges(charges.filter(charge => charge.id !== id));
    }
  };

  const toggleActive = (id: number) => {
    setCharges(charges.map(charge => 
      charge.id === id ? { ...charge, isActive: !charge.isActive } : charge
    ));
  };

  const getServiceTypeColor = (appliesTo: string) => {
    switch (appliesTo) {
      case 'delivery': return 'badge-orange';
      case 'takeaway': return 'badge-green';
      case 'dining': return 'badge bg-orange-light text-orange';
      default: return 'badge bg-muted text-secondary';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Extra Charges</h1>
          <p className="text-secondary">Manage delivery fees, service charges, and other extra costs</p>
        </div>
        <button 
          onClick={() => setIsAddingNew(true)}
          className="btn btn-primary"
          disabled={isAddingNew || editingId !== null}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Charge
        </button>
      </div>

      {/* Add/Edit Form */}
      {(isAddingNew || editingId) && (
        <div className="card mb-6">
          <h3 className="font-semibold text-primary mb-4">
            {editingId ? 'Edit Charge' : 'Add New Charge'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Charge Name *</label>
              <input
                type="text"
                placeholder="e.g., Delivery Fee, Service Charge"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div>
              <label className="form-label">Amount *</label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="Enter amount"
                  className="form-input pr-12"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  min="0"
                  step="0.01"
                />
                <div className="absolute right-3 top-1/2 transform translate-y-neg-half text-secondary">
                  {formData.type === 'fixed' ? '₹' : '%'}
                </div>
              </div>
            </div>

            <div>
              <label className="form-label">Charge Type</label>
              <select 
                className="form-input"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as 'fixed' | 'percentage'})}
              >
                <option value="fixed">Fixed Amount (₹)</option>
                <option value="percentage">Percentage (%)</option>
              </select>
            </div>

            <div>
              <label className="form-label">Applies To</label>
              <select 
                className="form-input"
                value={formData.appliesTo}
                onChange={(e) => setFormData({...formData, appliesTo: e.target.value as any})}
              >
                <option value="all">All Orders</option>
                <option value="delivery">Delivery Only</option>
                <option value="takeaway">Takeaway Only</option>
                <option value="dining">Dining Only</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <button 
              onClick={editingId ? handleSaveEdit : handleAddNew}
              className="btn btn-primary"
              disabled={!formData.name.trim() || !formData.amount}
            >
              <Save className="w-4 h-4 mr-1" />
              {editingId ? 'Update' : 'Add'} Charge
            </button>
            <button 
              onClick={handleCancelEdit}
              className="btn btn-secondary"
            >
              <X className="w-4 h-4 mr-1" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Charges List */}
      <div className="space-y-4">
        {charges.map((charge) => (
          <div key={charge.id} className={`card ${!charge.isActive ? 'opacity-50' : ''}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  charge.type === 'fixed' ? 'bg-green' : 'bg-orange'
                }`}>
                  {charge.type === 'fixed' ? (
                    <DollarSign className="w-6 h-6 text-white" />
                  ) : (
                    <Percent className="w-6 h-6 text-white" />
                  )}
                </div>
                
                <div>
                  <h3 className="font-semibold text-primary">{charge.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="font-bold text-lg text-primary">
                      {charge.type === 'fixed' ? '₹' : ''}{charge.amount}{charge.type === 'percentage' ? '%' : ''}
                    </span>
                    <span className={`${getServiceTypeColor(charge.appliesTo)} capitalize`}>
                      {charge.appliesTo === 'all' ? 'All Orders' : charge.appliesTo}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleActive(charge.id)}
                  className={`btn btn-sm ${charge.isActive ? 'btn-secondary' : 'btn-primary'}`}
                >
                  {charge.isActive ? 'Disable' : 'Enable'}
                </button>
                
                <button
                  onClick={() => handleEdit(charge)}
                  className="btn btn-secondary btn-sm"
                  disabled={editingId !== null || isAddingNew}
                >
                  <Edit className="w-4 h-4" />
                </button>
                
                <button 
                  onClick={() => handleDelete(charge.id)}
                  className="btn btn-sm w-10 h-10 bg-red text-white hover:bg-red"
                  disabled={editingId !== null || isAddingNew}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {charges.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-12 h-12 text-secondary" />
          </div>
          <h3 className="text-lg font-semibold text-primary mb-2">No Extra Charges</h3>
          <p className="text-secondary mb-4">Create your first extra charge to get started</p>
          <button 
            onClick={() => setIsAddingNew(true)}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add First Charge
          </button>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary">{charges.length}</div>
          <div className="text-sm text-secondary">Total Charges</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green">{charges.filter(c => c.isActive).length}</div>
          <div className="text-sm text-secondary">Active</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-orange">{charges.filter(c => c.type === 'fixed').length}</div>
          <div className="text-sm text-secondary">Fixed Amount</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary">{charges.filter(c => c.type === 'percentage').length}</div>
          <div className="text-sm text-secondary">Percentage</div>
        </div>
      </div>
    </div>
  );
}
