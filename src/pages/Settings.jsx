import { useState } from 'react';
import { 
  FiUser, FiLock, FiBell, FiSave, FiCheck, FiAlertCircle
} from 'react-icons/fi';
import api from '../services/api';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Profile Settings
  const [profileData, setProfileData] = useState({
    name: user.username || 'Admin User',
    email: user.email || 'admin@healthcare.com',
    phone: '',
    role: user.role || 'ADMIN'
  });

  // Security Settings
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Notification Settings
  const [notificationData, setNotificationData] = useState({
    emailNotifications: true,
    newUserAlerts: true,
    appointmentAlerts: true,
    systemAlerts: true
  });

  const handleChangePassword = async () => {
    setLoading(true);
    setError('');
    setSaveSuccess(false);

    try {
      // Validation
      if (!securityData.currentPassword || !securityData.newPassword || !securityData.confirmPassword) {
        throw new Error('All password fields are required');
      }

      if (securityData.newPassword !== securityData.confirmPassword) {
        throw new Error('New passwords do not match');
      }

      if (securityData.newPassword.length < 8) {
        throw new Error('Password must be at least 8 characters');
      }

      // Call API
      const response = await api.post('/users/change-password', {
        currentPassword: securityData.currentPassword,
        newPassword: securityData.newPassword
      });

      console.log('Password changed successfully:', response.data);
      setSaveSuccess(true);
      
      // Clear password fields
      setSecurityData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Password change error:', err);
      setError(err.response?.data?.error || err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setError('');
    setSaveSuccess(false);

    try {
      // Mock save - implement actual API call when endpoint is ready
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Saving profile settings...', profileData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setLoading(true);
    setError('');
    setSaveSuccess(false);

    try {
      // Mock save - implement actual API call when endpoint is ready
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Saving notification settings...', notificationData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save notifications');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'security', label: 'Security', icon: FiLock },
    { id: 'notifications', label: 'Notifications', icon: FiBell }
  ];

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>
          Settings
        </h1>
        <p style={{ color: '#6b7280' }}>
          Manage your account settings and preferences
        </p>
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
          <FiCheck size={20} />
          <span>Settings saved successfully!</span>
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
          <FiAlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <div style={{ display: 'flex', gap: '2rem' }}>
        {/* Sidebar Tabs */}
        <div style={{
          width: '250px',
          background: 'white',
          borderRadius: '12px',
          padding: '1rem',
          height: 'fit-content',
          border: '1px solid #e5e7eb'
        }}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: isActive ? '#f3f4f6' : 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  marginBottom: '0.5rem',
                  color: isActive ? '#667eea' : '#6b7280',
                  fontWeight: isActive ? '600' : '400',
                  transition: 'all 0.2s'
                }}
              >
                <Icon size={20} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div style={{ flex: 1 }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            border: '1px solid #e5e7eb'
          }}>
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: '#1f2937' }}>
                  Profile Settings
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Name */}
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                      Username
                    </label>
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

                  {/* Email */}
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
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
                    <small style={{ color: '#6b7280', fontSize: '0.875rem' }}>Email cannot be changed</small>
                  </div>

                  {/* Role */}
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                      Role
                    </label>
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

                  {/* Save Button */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={handleSaveProfile}
                      disabled={loading}
                      style={{
                        padding: '0.75rem 2rem',
                        background: loading ? '#9ca3af' : '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '600',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <FiSave />
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: '#1f2937' }}>
                  Security Settings
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Change Password */}
                  <div style={{ 
                    padding: '1.5rem', 
                    background: '#f9fafb', 
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <h3 style={{ fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
                      Change Password
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151', fontSize: '0.875rem' }}>
                          Current Password *
                        </label>
                        <input
                          type="password"
                          value={securityData.currentPassword}
                          onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                          placeholder="Enter your current password"
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
                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151', fontSize: '0.875rem' }}>
                          New Password *
                        </label>
                        <input
                          type="password"
                          value={securityData.newPassword}
                          onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                          placeholder="Enter new password (min 8 characters)"
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
                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151', fontSize: '0.875rem' }}>
                          Confirm New Password *
                        </label>
                        <input
                          type="password"
                          value={securityData.confirmPassword}
                          onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                          placeholder="Re-enter new password"
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '1rem'
                          }}
                        />
                      </div>

                      <div style={{
                        padding: '0.75rem',
                        background: '#fff7ed',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        color: '#9a3412'
                      }}>
                        <strong>Password Requirements:</strong>
                        <ul style={{ marginTop: '0.5rem', marginLeft: '1.5rem' }}>
                          <li>Minimum 8 characters</li>
                          <li>Mix of letters, numbers, and special characters recommended</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={handleChangePassword}
                      disabled={loading}
                      style={{
                        padding: '0.75rem 2rem',
                        background: loading ? '#9ca3af' : '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '600',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <FiSave />
                      {loading ? 'Changing Password...' : 'Change Password'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: '#1f2937' }}>
                  Notification Preferences
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {[
                    { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                    { key: 'newUserAlerts', label: 'New User Alerts', desc: 'Get notified when new users register' },
                    { key: 'appointmentAlerts', label: 'Appointment Alerts', desc: 'Receive alerts about appointment changes' },
                    { key: 'systemAlerts', label: 'System Alerts', desc: 'Critical system notifications and errors' }
                  ].map(item => (
                    <div key={item.key} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '1rem',
                      background: '#f9fafb',
                      borderRadius: '8px'
                    }}>
                      <div>
                        <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>
                          {item.label}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {item.desc}
                        </div>
                      </div>
                      <label style={{ position: 'relative', display: 'inline-block', width: '60px', height: '34px' }}>
                        <input
                          type="checkbox"
                          checked={notificationData[item.key]}
                          onChange={(e) => setNotificationData({ ...notificationData, [item.key]: e.target.checked })}
                          style={{ opacity: 0, width: 0, height: 0 }}
                        />
                        <span style={{
                          position: 'absolute',
                          cursor: 'pointer',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: notificationData[item.key] ? '#10b981' : '#d1d5db',
                          borderRadius: '34px',
                          transition: '0.4s'
                        }}>
                          <span style={{
                            position: 'absolute',
                            content: '',
                            height: '26px',
                            width: '26px',
                            left: notificationData[item.key] ? '30px' : '4px',
                            bottom: '4px',
                            background: 'white',
                            borderRadius: '50%',
                            transition: '0.4s'
                          }} />
                        </span>
                      </label>
                    </div>
                  ))}

                  {/* Save Button */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={handleSaveNotifications}
                      disabled={loading}
                      style={{
                        padding: '0.75rem 2rem',
                        background: loading ? '#9ca3af' : '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '600',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <FiSave />
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
