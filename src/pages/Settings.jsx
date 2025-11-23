import { useState, useEffect } from 'react';
import { FiUser, FiLock, FiShield, FiUsers, FiSave, FiTrash2, FiPlus } from 'react-icons/fi';
import { authService } from '../services/authService';
import api from '../services/api';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');

  // Get current admin user
  const currentUser = JSON.parse(localStorage.getItem('adminUser') || '{}');

  // Profile Settings
  const [profileData, setProfileData] = useState({
    name: currentUser.firstName || 'Admin',
    email: currentUser.email || 'admin@healthcare.com',
    role: currentUser.role || 'ADMIN'
  });

  // Security Settings - Password Change
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });



  // Admin Users Management
  const [adminUsers, setAdminUsers] = useState([]);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    permissions: {
      canRead: true,
      canWrite: true,
      canDelete: false
    }
  });

  // Load admin users
  useEffect(() => {
    if (activeTab === 'admins') {
      loadAdminUsers();
    }
  }, [activeTab]);

  const loadAdminUsers = async () => {
    try {
      // Fetch all staff users from AD endpoint - this includes all admin users
      const response = await api.get('/users/staff');

      // The staff endpoint returns users with role property
      const users = response.data?.data || response.data || [];

      console.log('All staff users:', users);

      // Filter for ADMIN role users only
      const adminList = Array.isArray(users)
        ? users.filter(u => u.role && u.role.toUpperCase() === 'ADMIN')
        : [];

      console.log('Filtered admin users:', adminList);
      setAdminUsers(adminList);
    } catch (err) {
      console.error('Error loading admin users:', err);

      // Fallback: Try regular /users endpoint
      try {
        const fallbackResponse = await api.get('/users');
        const fallbackUsers = fallbackResponse.data?.data || fallbackResponse.data || [];
        const adminList = Array.isArray(fallbackUsers)
          ? fallbackUsers.filter(u => u.role && u.role.toUpperCase() === 'ADMIN')
          : [];

        console.log('Fallback admin users:', adminList);
        setAdminUsers(adminList);
      } catch (fallbackErr) {
        console.error('Fallback also failed:', fallbackErr);
        setAdminUsers([]);
      }
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setError('');
    setSaveSuccess(false);

    try {
      // Update profile via API
      await api.put(`/users/${currentUser.id}`, {
        firstName: profileData.name.split(' ')[0],
        lastName: profileData.name.split(' ').slice(1).join(' ') || '',
        email: profileData.email
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setLoading(true);
    setError('');
    setSaveSuccess(false);

    try {
      if (!securityData.currentPassword || !securityData.newPassword || !securityData.confirmPassword) {
        throw new Error('All password fields are required');
      }

      if (securityData.newPassword !== securityData.confirmPassword) {
        throw new Error('New passwords do not match');
      }

      if (securityData.newPassword.length < 8) {
        throw new Error('Password must be at least 8 characters');
      }

      await authService.changePassword(securityData.currentPassword, securityData.newPassword);

      setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };



  const handleAddAdminUser = async () => {
    setLoading(true);
    setError('');

    try {
      if (!newAdmin.username || !newAdmin.email || !newAdmin.password) {
        throw new Error('Username, email, and password are required');
      }

      // Register new admin user
      await api.post('/auth/register', {
        username: newAdmin.username,
        email: newAdmin.email,
        password: newAdmin.password,
        firstName: newAdmin.firstName,
        lastName: newAdmin.lastName,
        role: 'ADMIN'
      });

      setShowAddAdmin(false);
      setNewAdmin({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        permissions: { canRead: true, canWrite: true, canDelete: false }
      });

      loadAdminUsers();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add admin user');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (userId) => {
    if (!confirm('Are you sure you want to remove this admin user?')) return;

    try {
      await api.delete(`/users/${userId}`);
      loadAdminUsers();
    } catch (err) {
      setError('Failed to delete admin user');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'security', label: 'Security', icon: FiLock },
    { id: 'admins', label: 'Admin Users', icon: FiUsers }
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Settings</h1>
        <p style={{ color: '#6b7280' }}>Manage your account and system preferences</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '2px solid #e5e7eb' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '1rem 1.5rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid #667eea' : '2px solid transparent',
              color: activeTab === tab.id ? '#667eea' : '#6b7280',
              fontWeight: activeTab === tab.id ? '600' : '400',
              cursor: 'pointer',
              marginBottom: '-2px'
            }}
          >
            <tab.icon />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Success/Error Messages */}
      {saveSuccess && (
        <div style={{
          padding: '1rem',
          background: '#d1fae5',
          color: '#065f46',
          borderRadius: '8px',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          ✅ Settings saved successfully!
        </div>
      )}

      {error && (
        <div style={{
          padding: '1rem',
          background: '#fee2e2',
          color: '#991b1b',
          borderRadius: '8px',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          ❌ {error}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>Profile Information</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '500px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Name</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Email</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Role</label>
              <input
                type="text"
                value={profileData.role}
                disabled
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  background: '#f9fafb',
                  color: '#6b7280'
                }}
              />
            </div>

            <button
              onClick={handleSaveProfile}
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: loading ? '#9ca3af' : '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              <FiSave />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* Security Tab - Password Change */}
      {activeTab === 'security' && (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>Change Password</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '500px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Current Password</label>
              <input
                type="password"
                value={securityData.currentPassword}
                onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>New Password</label>
              <input
                type="password"
                value={securityData.newPassword}
                onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                Minimum 8 characters
              </p>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Confirm New Password</label>
              <input
                type="password"
                value={securityData.confirmPassword}
                onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>

            <button
              onClick={handleChangePassword}
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: loading ? '#9ca3af' : '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              <FiLock />
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </div>
      )}


      {/* Admin Users Management Tab */}
      {activeTab === 'admins' && (
        <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Admin Users  Management</h2>
            <button
              onClick={() => setShowAddAdmin(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <FiPlus />
              Add Admin User
            </button>
          </div>

          {/* Admin Users Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f9fafb' }}>
              <tr>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Name</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Email</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Permissions</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {adminUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>
                    No admin users found
                  </td>
                </tr>
              ) : (
                adminUsers.map(user => (
                  <tr key={user.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: '600' }}>{user.firstName} {user.lastName}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{user.username}</div>
                    </td>
                    <td style={{ padding: '1rem', color: '#374151' }}>{user.email}</td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          background: '#d1fae5',
                          color: '#065f46',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}>
                          READ
                        </span>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          background: '#dbeafe',
                          color: '#1e40af',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}>
                          WRITE
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <button
                        onClick={() => handleDeleteAdmin(user.id)}
                        style={{
                          padding: '0.5rem 1rem',
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: '500'
                        }}
                      >
                        <FiTrash2 style={{ display: 'inline', marginRight: '0.25rem' }} />
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Add Admin Modal */}
          {showAddAdmin && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000
            }}>
              <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '12px',
                width: '90%',
                maxWidth: '500px',
                maxHeight: '90vh',
                overflow: 'auto'
              }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>Add New Admin User</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Username *</label>
                    <input
                      type="text"
                      value={newAdmin.username}
                      onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>First Name</label>
                      <input
                        type="text"
                        value={newAdmin.firstName}
                        onChange={(e) => setNewAdmin({ ...newAdmin, firstName: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Last Name</label>
                      <input
                        type="text"
                        value={newAdmin.lastName}
                        onChange={(e) => setNewAdmin({ ...newAdmin, lastName: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Email *</label>
                    <input
                      type="email"
                      value={newAdmin.email}
                      onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Password *</label>
                    <input
                      type="password"
                      value={newAdmin.password}
                      onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>Permissions</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="checkbox"
                          checked={newAdmin.permissions.canRead}
                          onChange={(e) => setNewAdmin({
                            ...newAdmin,
                            permissions: { ...newAdmin.permissions, canRead: e.target.checked }
                          })}
                        />
                        Can Read (view data)
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="checkbox"
                          checked={newAdmin.permissions.canWrite}
                          onChange={(e) => setNewAdmin({
                            ...newAdmin,
                            permissions: { ...newAdmin.permissions, canWrite: e.target.checked }
                          })}
                        />
                        Can Write (create/edit data)
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="checkbox"
                          checked={newAdmin.permissions.canDelete}
                          onChange={(e) => setNewAdmin({
                            ...newAdmin,
                            permissions: { ...newAdmin.permissions, canDelete: e.target.checked }
                          })}
                        />
                        Can Delete (remove data)
                      </label>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button
                      onClick={handleAddAdminUser}
                      disabled={loading}
                      style={{
                        flex: 1,
                        padding: '0.75rem',
                        background: loading ? '#9ca3af' : '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '600',
                        cursor: loading ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {loading ? 'Adding...' : 'Add Admin User'}
                    </button>
                    <button
                      onClick={() => setShowAddAdmin(false)}
                      style={{
                        flex: 1,
                        padding: '0.75rem',
                        background: '#e5e7eb',
                        color: '#374151',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
