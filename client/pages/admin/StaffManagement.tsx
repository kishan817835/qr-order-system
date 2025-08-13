import { useState } from 'react';
import { User, Phone, Mail, Plus, Edit, Trash2, Eye, UserCheck, Lock, EyeOff, Key } from 'lucide-react';

type UserRole = 'kitchen' | 'delivery' | 'staff';
type UserStatus = 'active' | 'inactive' | 'busy';

interface StaffMember {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  joinedDate: string;
  lastActive: string;
  completedTasks: number;
}

export default function StaffManagement() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [staff, setStaff] = useState<StaffMember[]>([
    {
      id: 1,
      name: 'Raj Kumar',
      email: 'raj.kumar@spicegarden.com',
      phone: '+91 98765 11111',
      role: 'delivery',
      status: 'active',
      joinedDate: '2024-01-15',
      lastActive: new Date().toISOString(),
      completedTasks: 145
    },
    {
      id: 2,
      name: 'Amit Singh',
      email: 'amit.singh@spicegarden.com',
      phone: '+91 98765 22222',
      role: 'delivery',
      status: 'busy',
      joinedDate: '2024-02-10',
      lastActive: new Date(Date.now() - 300000).toISOString(),
      completedTasks: 89
    },
    {
      id: 3,
      name: 'Priya Sharma',
      email: 'priya.sharma@spicegarden.com',
      phone: '+91 98765 33333',
      role: 'kitchen',
      status: 'active',
      joinedDate: '2024-01-20',
      lastActive: new Date(Date.now() - 150000).toISOString(),
      completedTasks: 234
    },
    {
      id: 4,
      name: 'Vikash Patel',
      email: 'vikash.patel@spicegarden.com',
      phone: '+91 98765 44444',
      role: 'kitchen',
      status: 'active',
      joinedDate: '2024-03-05',
      lastActive: new Date(Date.now() - 600000).toISOString(),
      completedTasks: 67
    },
    {
      id: 5,
      name: 'Neha Gupta',
      email: 'neha.gupta@spicegarden.com',
      phone: '+91 98765 55555',
      role: 'staff',
      status: 'inactive',
      joinedDate: '2024-02-28',
      lastActive: new Date(Date.now() - 86400000).toISOString(),
      completedTasks: 23
    }
  ]);

  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<UserStatus | 'all'>('all');

  const filteredStaff = staff.filter(member => {
    const roleMatch = filterRole === 'all' || member.role === filterRole;
    const statusMatch = filterStatus === 'all' || member.status === filterStatus;
    return roleMatch && statusMatch;
  });

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'kitchen': return '👨‍🍳';
      case 'delivery': return '🚚';
      case 'staff': return '👨‍💻';
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'kitchen': return 'bg-orange text-white';
      case 'delivery': return 'bg-blue-600 text-white';
      case 'staff': return 'bg-purple-600 text-white';
    }
  };

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case 'active': return 'bg-green text-white';
      case 'busy': return 'bg-orange text-white';
      case 'inactive': return 'bg-red text-white';
    }
  };

  const formatLastActive = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const toggleStatus = (id: number) => {
    setStaff(staff.map(member => 
      member.id === id 
        ? { 
            ...member, 
            status: member.status === 'active' ? 'inactive' : 'active',
            lastActive: new Date().toISOString()
          }
        : member
    ));
  };

  const deleteStaff = (id: number) => {
    if (window.confirm('Are you sure you want to remove this staff member?')) {
      setStaff(staff.filter(member => member.id !== id));
    }
  };

  const changePassword = (id: number) => {
    setSelectedStaffId(id);
    setShowPasswordModal(true);
    setNewPassword('');
    setConfirmPassword('');
  };

  const handlePasswordChange = () => {
    if (!newPassword.trim()) {
      alert('Please enter a new password!');
      return;
    }
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const staffMember = staff.find(s => s.id === selectedStaffId);
    if (staffMember) {
      // Simulate password change
      alert(`Password changed successfully for ${staffMember.name}!`);
      setShowPasswordModal(false);
      setSelectedStaffId(null);
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Staff Management</h1>
          <p className="text-secondary">Manage kitchen staff, delivery boys, and other employees</p>
        </div>
        <button className="btn btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Staff Member
        </button>
      </div>

      {/* Staff Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card text-center">
          <div className="w-12 h-12 bg-orange rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-white text-lg">👨‍🍳</span>
          </div>
          <div className="text-2xl font-bold text-primary">
            {staff.filter(s => s.role === 'kitchen').length}
          </div>
          <div className="text-sm text-secondary">Kitchen Staff</div>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-white text-lg">🚚</span>
          </div>
          <div className="text-2xl font-bold text-primary">
            {staff.filter(s => s.role === 'delivery').length}
          </div>
          <div className="text-sm text-secondary">Delivery Boys</div>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-white text-lg">👨‍💻</span>
          </div>
          <div className="text-2xl font-bold text-primary">
            {staff.filter(s => s.role === 'staff').length}
          </div>
          <div className="text-sm text-secondary">General Staff</div>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-green rounded-full flex items-center justify-center mx-auto mb-3">
            <UserCheck className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-primary">
            {staff.filter(s => s.status === 'active').length}
          </div>
          <div className="text-sm text-secondary">Active Now</div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div>
            <label className="form-label">Filter by Role</label>
            <select 
              className="form-input"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as UserRole | 'all')}
            >
              <option value="all">All Roles</option>
              <option value="kitchen">Kitchen Staff</option>
              <option value="delivery">Delivery Boys</option>
              <option value="staff">General Staff</option>
            </select>
          </div>
          <div>
            <label className="form-label">Filter by Status</label>
            <select 
              className="form-input"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as UserStatus | 'all')}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="busy">Busy</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <div className="card overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Staff Member</th>
              <th>Role</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Performance</th>
              <th>Last Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.map((member) => (
              <tr key={member.id}>
                <td>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="font-semibold text-primary">{member.name}</p>
                      <p className="text-sm text-secondary">ID: {member.id}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(member.role)}`}>
                    <span className="mr-1">{getRoleIcon(member.role)}</span>
                    {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                  </span>
                </td>
                <td>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-3 h-3 text-secondary" />
                      <span className="text-sm text-secondary">{member.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-3 h-3 text-secondary" />
                      <span className="text-sm text-secondary">{member.email}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                    {member.status.toUpperCase()}
                  </span>
                </td>
                <td>
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">{member.completedTasks}</div>
                    <div className="text-xs text-secondary">Tasks Completed</div>
                  </div>
                </td>
                <td>
                  <span className="text-sm text-secondary">
                    {formatLastActive(member.lastActive)}
                  </span>
                </td>
                <td>
                  <div className="flex flex-wrap gap-2">
                    <button className="btn btn-secondary btn-sm">
                      <Eye className="w-3 h-3" />
                    </button>
                    <button className="btn btn-secondary btn-sm">
                      <Edit className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => changePassword(member.id)}
                      className="btn btn-sm bg-purple-600 text-white hover:bg-purple-700"
                      title="Change Password"
                    >
                      <Key className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => toggleStatus(member.id)}
                      className={`btn btn-sm ${
                        member.status === 'active' ? 'bg-orange text-white hover:bg-orange-dark' : 'btn-primary'
                      }`}
                      title={member.status === 'active' ? 'Deactivate Staff' : 'Activate Staff'}
                    >
                      {member.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => deleteStaff(member.id)}
                      className="btn btn-sm bg-red text-white hover:bg-red-dark"
                      title="Delete Staff"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredStaff.length === 0 && (
          <div className="text-center py-8">
            <User className="w-12 h-12 text-muted mx-auto mb-4" />
            <p className="text-secondary">No staff members found matching your filters.</p>
          </div>
        )}
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="card">
          <h3 className="font-semibold text-primary mb-3">Top Performers</h3>
          {staff
            .sort((a, b) => b.completedTasks - a.completedTasks)
            .slice(0, 3)
            .map((member, index) => (
              <div key={member.id} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    index === 0 ? 'bg-orange text-white' : 
                    index === 1 ? 'bg-muted text-secondary' : 'bg-muted text-secondary'
                  }`}>
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-primary">{member.name}</span>
                </div>
                <span className="text-sm font-bold text-green">{member.completedTasks}</span>
              </div>
            ))}
        </div>

        <div className="card">
          <h3 className="font-semibold text-primary mb-3">Recent Activities</h3>
          {staff
            .sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime())
            .slice(0, 3)
            .map((member) => (
              <div key={member.id} className="py-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-primary">{member.name}</span>
                  <span className="text-xs text-secondary">{formatLastActive(member.lastActive)}</span>
                </div>
                <p className="text-xs text-muted">{member.role} • {member.status}</p>
              </div>
            ))}
        </div>

        <div className="card">
          <h3 className="font-semibold text-primary mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <button className="btn btn-secondary btn-sm w-full">
              Export Staff Report
            </button>
            <button className="btn btn-secondary btn-sm w-full">
              Send Notifications
            </button>
            <button className="btn btn-secondary btn-sm w-full">
              Performance Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
