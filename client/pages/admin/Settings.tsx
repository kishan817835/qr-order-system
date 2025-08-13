import { useState } from 'react';
import { Save, Clock, MapPin, Phone, Globe, Camera } from 'lucide-react';

export default function Settings() {
  const [settings, setSettings] = useState({
    restaurantName: 'Spice Garden',
    address: '123 Main Street, Food District',
    phone: '+91 12345 67890',
    email: 'info@spicegarden.com',
    openingHours: {
      monday: { open: '09:00', close: '22:00', closed: false },
      tuesday: { open: '09:00', close: '22:00', closed: false },
      wednesday: { open: '09:00', close: '22:00', closed: false },
      thursday: { open: '09:00', close: '22:00', closed: false },
      friday: { open: '09:00', close: '23:00', closed: false },
      saturday: { open: '09:00', close: '23:00', closed: false },
      sunday: { open: '10:00', close: '22:00', closed: false }
    },
    deliveryRadius: '5',
    minimumOrderValue: '200',
    estimatedDeliveryTime: '30-45',
    takeawayTime: '15-20'
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // In real app, this would save to database
    console.log('Saving settings:', settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const updateOpeningHours = (day: string, field: string, value: string | boolean) => {
    setSettings({
      ...settings,
      openingHours: {
        ...settings.openingHours,
        [day]: {
          ...settings.openingHours[day as keyof typeof settings.openingHours],
          [field]: value
        }
      }
    });
  };

  const days = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Restaurant Settings</h1>
          <p className="text-secondary">Manage your restaurant information and preferences</p>
        </div>
        <button 
          onClick={handleSave}
          className={`btn ${saved ? 'btn-secondary' : 'btn-primary'}`}
        >
          <Save className="w-4 h-4 mr-2" />
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-6">
        {/* Restaurant Information */}
        <div className="card">
          <h2 className="text-lg font-semibold text-primary mb-4">Restaurant Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Restaurant Name</label>
              <input
                type="text"
                className="form-input"
                value={settings.restaurantName}
                onChange={(e) => setSettings({...settings, restaurantName: e.target.value})}
              />
            </div>
            
            <div>
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-input"
                value={settings.phone}
                onChange={(e) => setSettings({...settings, phone: e.target.value})}
              />
            </div>

            <div className="md:col-span-2">
              <label className="form-label flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Address
              </label>
              <textarea
                className="form-input min-h-20"
                rows={3}
                value={settings.address}
                onChange={(e) => setSettings({...settings, address: e.target.value})}
              />
            </div>

            <div>
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={settings.email}
                onChange={(e) => setSettings({...settings, email: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Opening Hours */}
        <div className="card">
          <h2 className="text-lg font-semibold text-primary mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Opening Hours
          </h2>
          <div className="space-y-3">
            {days.map(({ key, label }) => {
              const dayHours = settings.openingHours[key as keyof typeof settings.openingHours];
              return (
                <div key={key} className="flex items-center space-x-4">
                  <div className="w-24 text-sm font-medium text-primary">{label}</div>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={!dayHours.closed}
                      onChange={(e) => updateOpeningHours(key, 'closed', !e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-secondary">Open</span>
                  </label>

                  {!dayHours.closed && (
                    <>
                      <input
                        type="time"
                        className="form-input w-32"
                        value={dayHours.open}
                        onChange={(e) => updateOpeningHours(key, 'open', e.target.value)}
                      />
                      <span className="text-secondary">to</span>
                      <input
                        type="time"
                        className="form-input w-32"
                        value={dayHours.close}
                        onChange={(e) => updateOpeningHours(key, 'close', e.target.value)}
                      />
                    </>
                  )}

                  {dayHours.closed && (
                    <span className="text-sm text-muted italic">Closed</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Delivery Settings */}
        <div className="card">
          <h2 className="text-lg font-semibold text-primary mb-4">Delivery & Takeaway Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Delivery Radius (km)</label>
              <input
                type="number"
                className="form-input"
                value={settings.deliveryRadius}
                onChange={(e) => setSettings({...settings, deliveryRadius: e.target.value})}
                min="1"
                max="50"
              />
            </div>

            <div>
              <label className="form-label">Minimum Order Value (₹)</label>
              <input
                type="number"
                className="form-input"
                value={settings.minimumOrderValue}
                onChange={(e) => setSettings({...settings, minimumOrderValue: e.target.value})}
                min="0"
              />
            </div>

            <div>
              <label className="form-label">Estimated Delivery Time (minutes)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., 30-45"
                value={settings.estimatedDeliveryTime}
                onChange={(e) => setSettings({...settings, estimatedDeliveryTime: e.target.value})}
              />
            </div>

            <div>
              <label className="form-label">Takeaway Preparation Time (minutes)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., 15-20"
                value={settings.takeawayTime}
                onChange={(e) => setSettings({...settings, takeawayTime: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-lg font-semibold text-primary mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="btn btn-secondary flex items-center justify-center">
              <Camera className="w-4 h-4 mr-2" />
              Update Logo
            </button>
            <button className="btn btn-secondary flex items-center justify-center">
              <Globe className="w-4 h-4 mr-2" />
              Update Banner
            </button>
            <button className="btn btn-secondary flex items-center justify-center">
              Export Menu
            </button>
            <button className="btn btn-secondary flex items-center justify-center">
              Backup Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
