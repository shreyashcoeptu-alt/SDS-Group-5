import React, { useState, useEffect, useCallback } from 'react';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  Users, 
  ShieldCheck, 
  UserCheck, 
  UserX, 
  Search, 
  Filter, 
  Trash2, 
  RefreshCw, 
  UserCog, 
  Activity, 
  UtensilsCrossed, 
  ClipboardList,
  AlertTriangle
} from 'lucide-react';

const AdminDashboard = () => {
  const { user: currentAdmin } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('users');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCustomers: 0,
    totalAdmins: 0,
    activeUsers: 0,
    suspendedUsers: 0,
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedUserToDelete, setSelectedUserToDelete] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Fetch stats and user list
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes] = await Promise.all([
        userAPI.getUserStats(),
        userAPI.getAllUsers({
          search: search.trim() || undefined,
          role: roleFilter || undefined,
          status: statusFilter || undefined,
        }),
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (usersRes.success) setUsers(usersRes.users);
    } catch (err) {
      showToast(err.message || 'Failed to fetch user directory', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, statusFilter, showToast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchData]);

  // Handle role toggle
  const handleToggleRole = async (targetUser) => {
    if (targetUser._id === currentAdmin.id) {
      showToast('You cannot modify your own administrative role.', 'error');
      return;
    }

    const newRole = targetUser.role === 'cafeteria_admin' ? 'customer' : 'cafeteria_admin';
    setActionLoadingId(targetUser._id);
    try {
      const res = await userAPI.updateUserRoleOrStatus(targetUser._id, { role: newRole });
      showToast(res.message || 'User role updated', 'success');
      await fetchData();
    } catch (err) {
      showToast(err.message || 'Role update failed', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle status toggle (active <-> suspended)
  const handleToggleStatus = async (targetUser) => {
    if (targetUser._id === currentAdmin.id) {
      showToast('You cannot suspend your own administrative account.', 'error');
      return;
    }

    const newStatus = targetUser.status === 'active' ? 'suspended' : 'active';
    setActionLoadingId(targetUser._id);
    try {
      const res = await userAPI.updateUserRoleOrStatus(targetUser._id, { status: newStatus });
      showToast(res.message || 'User status updated', 'success');
      await fetchData();
    } catch (err) {
      showToast(err.message || 'Status update failed', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    if (!selectedUserToDelete) return;
    setActionLoadingId(selectedUserToDelete._id);
    try {
      const res = await userAPI.deleteUser(selectedUserToDelete._id);
      showToast(res.message || 'User deleted successfully', 'success');
      setSelectedUserToDelete(null);
      await fetchData();
    } catch (err) {
      showToast(err.message || 'Failed to delete user', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Admin Top Header */}
      <div className="glass-card" style={{
        padding: '2.5rem',
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(234, 88, 12, 0.08) 100%), #131a29',
        border: '1px solid rgba(139, 92, 246, 0.25)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <span className="badge badge-admin">
              <ShieldCheck size={13} /> Cafeteria Admin Portal
            </span>
            <span className="badge badge-status-active">
              <Activity size={13} /> Auth & User Mgmt (Student 1)
            </span>
          </div>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>
            Cafeteria Management Console
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '650px' }}>
            Welcome, <strong>{currentAdmin?.name}</strong>. Full control over user accounts, role-based privileges, security credentials, and teammate service hooks.
          </p>
        </div>

        <button
          onClick={fetchData}
          className="btn btn-secondary"
          title="Refresh user data"
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Real-time Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalUsers}</div>
            <div className="stat-label">Total Registered Users</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon secondary">
            <UserCheck size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalCustomers}</div>
            <div className="stat-label">Active Customers / Students</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon admin">
            <ShieldCheck size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalAdmins}</div>
            <div className="stat-label">Cafeteria Admin Staff</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon success">
            <Activity size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.activeUsers}</div>
            <div className="stat-label">Active Accounts ({stats.suspendedUsers} Suspended)</div>
          </div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="tab-nav">
        <button
          className={`tab-btn admin-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <UserCog size={17} />
          <span>User Management (Student 1)</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'menu' ? 'active' : ''}`}
          onClick={() => setActiveTab('menu')}
        >
          <UtensilsCrossed size={17} />
          <span>Menu Catalog (Student 2)</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <ClipboardList size={17} />
          <span>Live Orders & Kitchen (Student 4)</span>
        </button>
      </div>

      {/* Tab 1: User Management (Student 1 Feature Owner) */}
      {activeTab === 'users' && (
        <div className="glass-card animate-fade-in" style={{ padding: '1.75rem' }}>
          {/* Controls: Search and Filters */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', flex: 1, minWidth: '280px' }}>
              {/* Search Bar */}
              <div className="input-wrapper" style={{ flex: 1, minWidth: '220px' }}>
                <span className="input-icon">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  className="custom-input"
                  placeholder="Search user by name, email, or phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Role Filter */}
              <div style={{ minWidth: '150px' }}>
                <select
                  className="custom-input no-icon"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  style={{ cursor: 'pointer' }}
                >
                  <option value="">All Roles</option>
                  <option value="customer">Customer Only</option>
                  <option value="cafeteria_admin">Cafeteria Admin Only</option>
                </select>
              </div>

              {/* Status Filter */}
              <div style={{ minWidth: '140px' }}>
                <select
                  className="custom-input no-icon"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ cursor: 'pointer' }}
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
              Showing <strong>{users.length}</strong> accounts
            </div>
          </div>

          {/* User Table */}
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>User Details</th>
                  <th>Contact Info</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                      {loading ? 'Loading user directory...' : 'No users match your search or filter criteria.'}
                    </td>
                  </tr>
                ) : (
                  users.map((u) => {
                    const isSelf = u._id === currentAdmin.id;
                    const isUpdating = actionLoadingId === u._id;

                    return (
                      <tr key={u._id}>
                        {/* Name & Avatar */}
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div className={`avatar-circle ${u.role === 'cafeteria_admin' ? 'admin' : ''}`}>
                              {u.name?.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontWeight: '600', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                {u.name}
                                {isSelf && (
                                  <span style={{ fontSize: '0.68rem', color: '#fb923c', background: 'var(--primary-light)', padding: '1px 6px', borderRadius: '4px' }}>
                                    (You)
                                  </span>
                                )}
                              </div>
                              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                                ID: {u._id}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Email & Phone */}
                        <td>
                          <div style={{ color: '#fff', fontSize: '0.88rem' }}>{u.email}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {u.phone || 'No phone'}
                          </div>
                        </td>

                        {/* Role Badge */}
                        <td>
                          <span className={`badge ${u.role === 'cafeteria_admin' ? 'badge-admin' : 'badge-customer'}`}>
                            {u.role === 'cafeteria_admin' ? 'Cafeteria Admin' : 'Customer'}
                          </span>
                        </td>

                        {/* Status Badge */}
                        <td>
                          <span className={`badge ${u.status === 'active' ? 'badge-status-active' : 'badge-status-suspended'}`}>
                            {u.status === 'active' ? 'Active' : 'Suspended'}
                          </span>
                        </td>

                        {/* Created At */}
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>

                        {/* Actions */}
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
                            {/* Toggle Role */}
                            <button
                              onClick={() => handleToggleRole(u)}
                              disabled={isSelf || isUpdating}
                              className="btn btn-secondary btn-sm"
                              title={u.role === 'cafeteria_admin' ? 'Demote to Customer' : 'Promote to Cafeteria Admin'}
                              style={{ padding: '0.35rem 0.65rem' }}
                            >
                              <ShieldCheck size={14} color={u.role === 'cafeteria_admin' ? '#c084fc' : '#94a3b8'} />
                              <span>{u.role === 'cafeteria_admin' ? 'Demote' : 'Promote'}</span>
                            </button>

                            {/* Toggle Status */}
                            <button
                              onClick={() => handleToggleStatus(u)}
                              disabled={isSelf || isUpdating}
                              className="btn btn-secondary btn-sm"
                              title={u.status === 'active' ? 'Suspend Account' : 'Reactivate Account'}
                              style={{ padding: '0.35rem 0.65rem' }}
                            >
                              {u.status === 'active' ? (
                                <UserX size={14} color="#f87171" />
                              ) : (
                                <UserCheck size={14} color="#34d399" />
                              )}
                              <span>{u.status === 'active' ? 'Suspend' : 'Activate'}</span>
                            </button>

                            {/* Delete User */}
                            <button
                              onClick={() => setSelectedUserToDelete(u)}
                              disabled={isSelf || isUpdating}
                              className="btn btn-danger btn-sm"
                              title="Delete User Account"
                              style={{ padding: '0.35rem 0.65rem' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Teammate Student 2 Menu Management */}
      {activeTab === 'menu' && (
        <div className="teammate-card glass-card animate-fade-in">
          <UtensilsCrossed size={48} color="#0284c7" style={{ margin: '0 auto 1rem' }} />
          <h3>Student 2 — Menu & Food Management Hub</h3>
          <p>
            Student 2 will plug in cafeteria food catalogs, item categories, price management, and item availability toggles here.
          </p>
          <div style={{ display: 'inline-flex', gap: '0.75rem', background: 'var(--surface-input)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
            <span>Backend Mount: <code>/api/menu</code></span>
            <span>•</span>
            <span style={{ color: '#38bdf8' }}>Ready for Student 2 Controller & Routes</span>
          </div>
        </div>
      )}

      {/* Tab 3: Teammate Student 4 Order Tracking */}
      {activeTab === 'orders' && (
        <div className="teammate-card glass-card animate-fade-in">
          <ClipboardList size={48} color="#8b5cf6" style={{ margin: '0 auto 1rem' }} />
          <h3>Student 4 — Kitchen Orders & Admin Dashboard</h3>
          <p>
            Student 4 will display incoming cafeteria order queues, order state updates (Preparing, Ready, Picked up), and daily sales totals here.
          </p>
          <div style={{ display: 'inline-flex', gap: '0.75rem', background: 'var(--surface-input)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
            <span>Backend Mount: <code>/api/orders</code> & <code>/api/admin-dashboard</code></span>
            <span>•</span>
            <span style={{ color: '#c084fc' }}>Ready for Student 4 Controller & Routes</span>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {selectedUserToDelete && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: '#f87171' }}>
              <AlertTriangle size={24} />
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Confirm User Deletion</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.92rem' }}>
              Are you sure you want to permanently delete the account for <strong>{selectedUserToDelete.name}</strong> ({selectedUserToDelete.email})? This action removes their credentials from MongoDB and cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setSelectedUserToDelete(null)}
                disabled={actionLoadingId === selectedUserToDelete._id}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDeleteUser}
                disabled={actionLoadingId === selectedUserToDelete._id}
              >
                <Trash2 size={16} />
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
