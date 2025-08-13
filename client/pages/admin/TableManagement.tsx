import { useState } from 'react';
import {
  Plus,
  Edit3,
  Trash2,
  QrCode,
  Users,
  MapPin,
  Eye,
  Download,
  Copy,
  Check
} from 'lucide-react';
import QRCodeGenerator from '../../components/QRCodeGenerator';

interface RestaurantTable {
  id: number;
  tableNumber: number;
  chairCount: number;
  location: string;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  qrCodeUrl: string;
  createdAt: string;
  lastUsed?: string;
}

export default function TableManagement() {
  const [tables, setTables] = useState<RestaurantTable[]>([
    {
      id: 1,
      tableNumber: 1,
      chairCount: 4,
      location: 'Near Window',
      status: 'available',
      qrCodeUrl: `${window.location.origin}/menu/1?table=1&service=dining`,
      createdAt: '2024-01-15',
      lastUsed: '2024-03-10'
    },
    {
      id: 2,
      tableNumber: 2,
      chairCount: 2,
      location: 'Center Hall',
      status: 'occupied',
      qrCodeUrl: `${window.location.origin}/menu/1?table=2&service=dining`,
      createdAt: '2024-01-15',
      lastUsed: '2024-03-11'
    },
    {
      id: 3,
      tableNumber: 3,
      chairCount: 6,
      location: 'VIP Section',
      status: 'reserved',
      qrCodeUrl: `${window.location.origin}/menu/1?table=3&service=dining`,
      createdAt: '2024-01-15'
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState<RestaurantTable | null>(null);
  const [copiedTableId, setCopiedTableId] = useState<number | null>(null);

  const [newTable, setNewTable] = useState({
    chairCount: 4,
    location: '',
    status: 'available' as const
  });

  const [editTable, setEditTable] = useState({
    chairCount: 4,
    location: '',
    status: 'available' as const
  });

  const getNextTableNumber = () => {
    if (tables.length === 0) return 1;
    return Math.max(...tables.map(t => t.tableNumber)) + 1;
  };

  const generateQRCodeUrl = (tableNumber: number) => {
    return `${window.location.origin}/menu/1?table=${tableNumber}&service=dining`;
  };

  const createTable = () => {
    if (!newTable.location.trim()) {
      alert('Please enter table location!');
      return;
    }

    const tableNumber = getNextTableNumber();
    const table: RestaurantTable = {
      id: Date.now(),
      tableNumber,
      chairCount: newTable.chairCount,
      location: newTable.location.trim(),
      status: newTable.status,
      qrCodeUrl: generateQRCodeUrl(tableNumber),
      createdAt: new Date().toISOString().split('T')[0]
    };

    setTables([...tables, table]);
    setShowCreateModal(false);
    setNewTable({
      chairCount: 4,
      location: '',
      status: 'available'
    });
  };

  const updateTable = () => {
    if (!selectedTable) return;
    if (!editTable.location.trim()) {
      alert('Please enter table location!');
      return;
    }

    setTables(tables.map(table => 
      table.id === selectedTable.id 
        ? {
            ...table,
            chairCount: editTable.chairCount,
            location: editTable.location.trim(),
            status: editTable.status
          }
        : table
    ));

    setShowEditModal(false);
    setSelectedTable(null);
  };

  const deleteTable = (tableId: number) => {
    const table = tables.find(t => t.id === tableId);
    if (!table) return;

    if (window.confirm(`Are you sure you want to delete Table ${table.tableNumber}? This action cannot be undone.`)) {
      setTables(tables.filter(t => t.id !== tableId));
    }
  };

  const openEditModal = (table: RestaurantTable) => {
    setSelectedTable(table);
    setEditTable({
      chairCount: table.chairCount,
      location: table.location,
      status: table.status
    });
    setShowEditModal(true);
  };

  const openQRModal = (table: RestaurantTable) => {
    setSelectedTable(table);
    setShowQRModal(true);
  };

  const copyQRUrl = async (table: RestaurantTable) => {
    try {
      await navigator.clipboard.writeText(table.qrCodeUrl);
      setCopiedTableId(table.id);
      setTimeout(() => setCopiedTableId(null), 2000);
    } catch (err) {
      alert('Failed to copy URL!');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green text-white';
      case 'occupied': return 'bg-red text-white';
      case 'reserved': return 'bg-orange text-white';
      case 'maintenance': return 'bg-muted text-secondary';
      default: return 'bg-muted text-secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return '✅';
      case 'occupied': return '🔴';
      case 'reserved': return '⏰';
      case 'maintenance': return '🔧';
      default: return '❓';
    }
  };

  const changeTableStatus = (tableId: number, newStatus: 'available' | 'occupied' | 'reserved' | 'maintenance') => {
    setTables(tables.map(table =>
      table.id === tableId
        ? { ...table, status: newStatus, lastUsed: newStatus === 'available' ? new Date().toISOString().split('T')[0] : table.lastUsed }
        : table
    ));
  };

  const printAllQRCodes = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Codes - All Tables</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .qr-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 30px; }
            .qr-item { text-align: center; border: 1px solid #ddd; padding: 20px; border-radius: 8px; }
            .qr-placeholder { width: 150px; height: 150px; border: 2px solid #333; margin: 0 auto 10px;
                             display: flex; align-items: center; justify-content: center; font-size: 12px; }
            h1 { text-align: center; color: #333; }
            .table-info { margin-bottom: 10px; font-weight: bold; }
            .url { font-size: 10px; word-break: break-all; color: #666; margin-top: 10px; }
            @media print {
              .no-print { display: none; }
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          <h1>Spice Garden - Table QR Codes</h1>
          <div class="qr-grid">
            ${tables.map(table => `
              <div class="qr-item">
                <div class="table-info">Table ${table.tableNumber}</div>
                <div class="qr-placeholder">QR Code<br/>Table ${table.tableNumber}</div>
                <div>${table.location}</div>
                <div class="url">${table.qrCodeUrl}</div>
              </div>
            `).join('')}
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              }
            }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Table Management</h1>
          <p className="text-secondary">Manage restaurant tables and QR codes</p>
        </div>
        <div className="flex space-x-3">
          {tables.length > 0 && (
            <button
              onClick={printAllQRCodes}
              className="btn btn-secondary"
            >
              <Download className="w-4 h-4 mr-2" />
              Print All QR
            </button>
          )}
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Table
          </button>
        </div>
      </div>

      {/* Tables Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card text-center">
          <div className="w-12 h-12 bg-green rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-white text-lg">✅</span>
          </div>
          <div className="text-2xl font-bold text-primary">
            {tables.filter(t => t.status === 'available').length}
          </div>
          <div className="text-sm text-secondary">Available</div>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-red rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-white text-lg">🔴</span>
          </div>
          <div className="text-2xl font-bold text-primary">
            {tables.filter(t => t.status === 'occupied').length}
          </div>
          <div className="text-sm text-secondary">Occupied</div>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-orange rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-white text-lg">⏰</span>
          </div>
          <div className="text-2xl font-bold text-primary">
            {tables.filter(t => t.status === 'reserved').length}
          </div>
          <div className="text-sm text-secondary">Reserved</div>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-white text-lg">{tables.length}</span>
          </div>
          <div className="text-2xl font-bold text-primary">{tables.length}</div>
          <div className="text-sm text-secondary">Total Tables</div>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tables.map((table) => (
          <div key={table.id} className="card border-l-4 border-primary">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">{table.tableNumber}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-primary">Table {table.tableNumber}</h3>
                  <p className="text-sm text-secondary">{table.location}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <select
                  value={table.status}
                  onChange={(e) => changeTableStatus(table.id, e.target.value as any)}
                  className={`text-xs font-medium border-0 rounded-full px-2 py-1 ${getStatusColor(table.status)}`}
                  style={{ backgroundColor: getStatusColor(table.status).includes('bg-green') ? '#16a34a' :
                           getStatusColor(table.status).includes('bg-red') ? '#dc2626' :
                           getStatusColor(table.status).includes('bg-orange') ? '#ea580c' : '#6b7280' }}
                >
                  <option value="available">✅ Available</option>
                  <option value="occupied">🔴 Occupied</option>
                  <option value="reserved">⏰ Reserved</option>
                  <option value="maintenance">🔧 Maintenance</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm">
                <Users className="w-4 h-4 text-secondary" />
                <span className="text-secondary">{table.chairCount} chairs</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="w-4 h-4 text-secondary" />
                <span className="text-secondary">{table.location}</span>
              </div>
              {table.lastUsed && (
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-secondary">Last used: {table.lastUsed}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => openQRModal(table)}
                className="btn btn-secondary btn-sm flex-1"
              >
                <QrCode className="w-3 h-3 mr-1" />
                QR Code
              </button>
              <button
                onClick={() => copyQRUrl(table)}
                className={`btn btn-sm flex-1 ${
                  copiedTableId === table.id ? 'bg-green text-white' : 'btn-secondary'
                }`}
              >
                {copiedTableId === table.id ? (
                  <>
                    <Check className="w-3 h-3 mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 mr-1" />
                    Copy URL
                  </>
                )}
              </button>
              <button
                onClick={() => openEditModal(table)}
                className="btn btn-secondary btn-sm"
              >
                <Edit3 className="w-3 h-3" />
              </button>
              <button
                onClick={() => deleteTable(table.id)}
                className="btn btn-sm bg-red text-white hover:bg-red-dark"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {tables.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-secondary" />
          </div>
          <h3 className="text-lg font-semibold text-primary mb-2">No Tables Created</h3>
          <p className="text-secondary mb-4">Start by creating your first table</p>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create First Table
          </button>
        </div>
      )}

      {/* Create Table Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-primary">Create New Table</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-secondary hover:text-primary"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="form-label">Table Number</label>
                <input
                  type="text"
                  className="form-input bg-muted"
                  value={getNextTableNumber()}
                  disabled
                />
                <p className="text-xs text-secondary mt-1">Auto-assigned next available number</p>
              </div>

              <div>
                <label className="form-label flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Number of Chairs
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  className="form-input"
                  value={newTable.chairCount}
                  onChange={(e) => setNewTable({...newTable, chairCount: parseInt(e.target.value) || 1})}
                />
              </div>

              <div>
                <label className="form-label flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Location/Description
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Near Window, VIP Section, Center Hall"
                  value={newTable.location}
                  onChange={(e) => setNewTable({...newTable, location: e.target.value})}
                />
              </div>

              <div>
                <label className="form-label">Initial Status</label>
                <select
                  className="form-input"
                  value={newTable.status}
                  onChange={(e) => setNewTable({...newTable, status: e.target.value as any})}
                >
                  <option value="available">Available</option>
                  <option value="maintenance">Under Maintenance</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={createTable}
                  className="btn btn-primary flex-1"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Table
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Table Modal */}
      {showEditModal && selectedTable && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-primary">Edit Table {selectedTable.tableNumber}</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-secondary hover:text-primary"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="form-label">Table Number</label>
                <input
                  type="text"
                  className="form-input bg-muted"
                  value={selectedTable.tableNumber}
                  disabled
                />
                <p className="text-xs text-secondary mt-1">Table number cannot be changed</p>
              </div>

              <div>
                <label className="form-label flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Number of Chairs
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  className="form-input"
                  value={editTable.chairCount}
                  onChange={(e) => setEditTable({...editTable, chairCount: parseInt(e.target.value) || 1})}
                />
              </div>

              <div>
                <label className="form-label flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Location/Description
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Near Window, VIP Section, Center Hall"
                  value={editTable.location}
                  onChange={(e) => setEditTable({...editTable, location: e.target.value})}
                />
              </div>

              <div>
                <label className="form-label">Status</label>
                <select
                  className="form-input"
                  value={editTable.status}
                  onChange={(e) => setEditTable({...editTable, status: e.target.value as any})}
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="reserved">Reserved</option>
                  <option value="maintenance">Under Maintenance</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={updateTable}
                  className="btn btn-primary flex-1"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQRModal && selectedTable && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-primary">QR Code - Table {selectedTable.tableNumber}</h3>
              <button
                onClick={() => setShowQRModal(false)}
                className="text-secondary hover:text-primary"
              >
                ×
              </button>
            </div>

            <QRCodeGenerator
              text={selectedTable.qrCodeUrl}
              size={192}
              tableNumber={selectedTable.tableNumber}
              onCopy={() => {
                setCopiedTableId(selectedTable.id);
                setTimeout(() => setCopiedTableId(null), 2000);
              }}
              onDownload={() => {
                console.log(`Downloaded QR for Table ${selectedTable.tableNumber}`);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
