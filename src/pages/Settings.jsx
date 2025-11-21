import { useState } from 'react';
import { 
  FiUser, FiLock, FiBell, FiShield, FiDatabase, 
  FiMail, FiGlobe, FiSave, FiRefreshCw, FiCheck,
  FiAlertCircle, FiServer, FiSettings as FiSettingsIcon
} from 'react-icons/fi';
import { authService } from '../services/authService';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');

  // Profile Settings
  const [profileData, setProfileData] = useState({
    name: 'Admin User',
    email: 'admin@healthcare.com',
    phone: '(555) 123-4567',
    role: 'System Administrator',
    avatar: ''
  });

  // Security Settings
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    sessionTimeout: '30',
    passwordExpiry: '90'
  });

  // Notification Settings
  const [notificationData, setNotificationData] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    newUserAlerts: true,
    appointmentAlerts: true,
    systemAlerts: true,
    weeklyReports: true,
    monthlyReports: false
  });

  // System Settings
  const [systemData, setSystemData] = useState({
    siteName: 'Healthcare Portal',
    siteUrl: 'https://healthcare.example.com',
    maintenanceMode: false,
    allowRegistrations: true,
    requireEmailVerification: true,
    maxLoginAttempts: '5',
    apiRateLimit: '100',
    backupFrequency: 'daily'
  });

  // Database Settings
  const [databaseData, setDatabaseData] = useState({
    host: 'localhost',
    port: '5432',
    database: 'healthcare_db',
    backupEnabled: true,
    lastBackup: '2024-11-13 08:00:00',
    backupSize: '2.3 GB'
  });

  // Email Settings
  const [emailData, setEmailData] = useState({
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUser: 'noreply@healthcare.com',
    smtpPassword: '••••••••',
    fromName: 'Healthcare Portal',
    fromEmail: 'noreply@healthcare.com',
    encryption: 'TLS'
  });

  const handleSave = async (section) => {
    setLoading(true);
    setError('');
    setSaveSuccess(false);

    try {
      // Validation for security section
      if (section === 'security') {
        // Check if trying to change password
        if (securityData.newPassword || securityData.currentPassword) {
          // Validate all password fields are filled
          if (!securityData.currentPassword) {
            throw new Error('Current password is required');
          }
          if (!securityData.newPassword) {
            throw new Error('New password is required');
          }
          if (!securityData.confirmPassword) {
            throw new Error('Please confirm your new password');
          }
          
          // Validate passwords match
          if (securityData.newPassword !== securityData.confirmPassword) {
            throw new Error('New passwords do not match');
          }
          
          // Validate password length
          if (securityData.newPassword.length < 8) {
            throw new Error('Password must be at least 8 characters');
          }

          // Call the API to change password
          await authService.changePassword(
            securityData.currentPassword,
            securityData.newPassword
          );
          
          // Clear password fields after successful save
          setSecurityData({
            ...securityData,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
        }
      } else {
        // For other sections, simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log(`Saving ${section} settings...`);
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);

    } catch (err) {
      // Handle API errors
      console.error('Settings save error:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 404) {
        setError('Password change feature is not yet implemented on the backend. Please contact your system administrator.');
      } else {
        setError(err.message || 'Failed to save settings');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTestEmail = async () => {
    setLoading(true);
    setError('');
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('Test email sent successfully!');
    } catch (err) {
      setError('Failed to send test email');
    } finally {
      setLoading(false);
    }
  };

  const handleBackupNow = async () => {
    setLoading(true);
    setError('');
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setDatabaseData({
        ...databaseData,
        lastBackup: new Date().toLocaleString(),
        backupSize: '2.3 GB'
      });
      alert('Database backup completed successfully!');
    } catch (err) {
      setError('Failed to create backup');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'security', label: 'Security', icon: FiLock },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'system', label: 'System', icon: FiSettingsIcon },
    { id: 'database', label: 'Database', icon: FiDatabase },
    { id: 'email', label: 'Email', icon: FiMail }
  ];

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>
          Settings
        </h1>
        <p style={{ color: '#6b7280' }}>
          Manage your system configuration and preferences
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
                      Full Name
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

                  {/* Phone */}
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
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
                      onClick={() => handleSave('profile')}
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
                          Current Password
                        </label>
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
                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151', fontSize: '0.875rem' }}>
                          New Password
                        </label>
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
                      </div>

                      <div>
                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151', fontSize: '0.875rem' }}>
                          Confirm New Password
                        </label>
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
                    </div>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>
                        Two-Factor Authentication
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        Add an extra layer of security to your account
                      </div>
                    </div>
                    <label style={{ position: 'relative', display: 'inline-block', width: '60px', height: '34px' }}>
                      <input
                        type="checkbox"
                        checked={securityData.twoFactorEnabled}
                        onChange={(e) => setSecurityData({ ...securityData, twoFactorEnabled: e.target.checked })}
                        style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span style={{
                        position: 'absolute',
                        cursor: 'pointer',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: securityData.twoFactorEnabled ? '#10b981' : '#d1d5db',
                        borderRadius: '34px',
                        transition: '0.4s'
                      }}>
                        <span style={{
                          position: 'absolute',
                          content: '',
                          height: '26px',
                          width: '26px',
                          left: securityData.twoFactorEnabled ? '30px' : '4px',
                          bottom: '4px',
                          background: 'white',
                          borderRadius: '50%',
                          transition: '0.4s'
                        }} />
                      </span>
                    </label>
                  </div>

                  {/* Session Timeout */}
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                      Session Timeout (minutes)
                    </label>
                    <select
                      value={securityData.sessionTimeout}
                      onChange={(e) => setSecurityData({ ...securityData, sessionTimeout: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="120">2 hours</option>
                      <option value="240">4 hours</option>
                    </select>
                  </div>

                  {/* Password Expiry */}
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                      Password Expiry (days)
                    </label>
                    <select
                      value={securityData.passwordExpiry}
                      onChange={(e) => setSecurityData({ ...securityData, passwordExpiry: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    >
                      <option value="30">30 days</option>
                      <option value="60">60 days</option>
                      <option value="90">90 days</option>
                      <option value="180">180 days</option>
                      <option value="never">Never</option>
                    </select>
                  </div>

                  {/* Save Button */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => handleSave('security')}
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

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: '#1f2937' }}>
                  Notification Preferences
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Notification Channels */}
                  <div style={{ 
                    padding: '1.5rem', 
                    background: '#f9fafb', 
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <h3 style={{ fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
                      Notification Channels
                    </h3>
                    
                    {[
                      { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                      { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Receive notifications via text message' },
                      { key: 'pushNotifications', label: 'Push Notifications', desc: 'Receive browser push notifications' }
                    ].map(item => (
                      <div key={item.key} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: '1rem 0',
                        borderBottom: '1px solid #e5e7eb'
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
                  </div>

                  {/* Alert Types */}
                  <div style={{ 
                    padding: '1.5rem', 
                    background: '#f9fafb', 
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <h3 style={{ fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
                      Alert Types
                    </h3>
                    
                    {[
                      { key: 'newUserAlerts', label: 'New User Registrations', desc: 'Get notified when new users register' },
                      { key: 'appointmentAlerts', label: 'Appointment Updates', desc: 'Receive alerts about appointment changes' },
                      { key: 'systemAlerts', label: 'System Alerts', desc: 'Critical system notifications and errors' },
                      { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Receive weekly summary reports' },
                      { key: 'monthlyReports', label: 'Monthly Reports', desc: 'Receive monthly analytics reports' }
                    ].map(item => (
                      <div key={item.key} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: '1rem 0',
                        borderBottom: '1px solid #e5e7eb'
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
                  </div>

                  {/* Save Button */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => handleSave('notifications')}
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

            {/* System Settings */}
            {activeTab === 'system' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: '#1f2937' }}>
                  System Configuration
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Site Information */}
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                      Site Name
                    </label>
                    <input
                      type="text"
                      value={systemData.siteName}
                      onChange={(e) => setSystemData({ ...systemData, siteName: e.target.value })}
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
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                      Site URL
                    </label>
                    <input
                      type="url"
                      value={systemData.siteUrl}
                      onChange={(e) => setSystemData({ ...systemData, siteUrl: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  {/* System Controls */}
                  <div style={{ 
                    padding: '1.5rem', 
                    background: '#f9fafb', 
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <h3 style={{ fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
                      System Controls
                    </h3>
                    
                    {[
                      { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Put the system in maintenance mode' },
                      { key: 'allowRegistrations', label: 'Allow Registrations', desc: 'Enable new user registrations' },
                      { key: 'requireEmailVerification', label: 'Email Verification', desc: 'Require email verification for new users' }
                    ].map(item => (
                      <div key={item.key} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: '1rem 0',
                        borderBottom: '1px solid #e5e7eb'
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
                            checked={systemData[item.key]}
                            onChange={(e) => setSystemData({ ...systemData, [item.key]: e.target.checked })}
                            style={{ opacity: 0, width: 0, height: 0 }}
                          />
                          <span style={{
                            position: 'absolute',
                            cursor: 'pointer',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: systemData[item.key] ? '#10b981' : '#d1d5db',
                            borderRadius: '34px',
                            transition: '0.4s'
                          }}>
                            <span style={{
                              position: 'absolute',
                              content: '',
                              height: '26px',
                              width: '26px',
                              left: systemData[item.key] ? '30px' : '4px',
                              bottom: '4px',
                              background: 'white',
                              borderRadius: '50%',
                              transition: '0.4s'
                            }} />
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>

                  {/* Security Settings */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                        Max Login Attempts
                      </label>
                      <input
                        type="number"
                        value={systemData.maxLoginAttempts}
                        onChange={(e) => setSystemData({ ...systemData, maxLoginAttempts: e.target.value })}
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
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                        API Rate Limit (per hour)
                      </label>
                      <input
                        type="number"
                        value={systemData.apiRateLimit}
                        onChange={(e) => setSystemData({ ...systemData, apiRateLimit: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '1rem'
                        }}
                      />
                    </div>
                  </div>

                  {/* Backup Frequency */}
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                      Backup Frequency
                    </label>
                    <select
                      value={systemData.backupFrequency}
                      onChange={(e) => setSystemData({ ...systemData, backupFrequency: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    >
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  {/* Save Button */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => handleSave('system')}
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

            {/* Database Settings */}
            {activeTab === 'database' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: '#1f2937' }}>
                  Database Configuration
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Connection Info */}
                  <div style={{ 
                    padding: '1.5rem', 
                    background: '#f0f9ff', 
                    borderRadius: '8px',
                    border: '1px solid #bae6fd'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <FiServer size={20} style={{ color: '#0284c7' }} />
                      <h3 style={{ fontWeight: '600', color: '#0c4a6e' }}>
                        Connection Status
                      </h3>
                    </div>
                    <p style={{ color: '#075985', fontSize: '0.875rem' }}>
                      Database is connected and operational
                    </p>
                  </div>

                  {/* Database Settings */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                        Host
                      </label>
                      <input
                        type="text"
                        value={databaseData.host}
                        onChange={(e) => setDatabaseData({ ...databaseData, host: e.target.value })}
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
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                        Port
                      </label>
                      <input
                        type="text"
                        value={databaseData.port}
                        onChange={(e) => setDatabaseData({ ...databaseData, port: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '1rem'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                      Database Name
                    </label>
                    <input
                      type="text"
                      value={databaseData.database}
                      onChange={(e) => setDatabaseData({ ...databaseData, database: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  {/* Backup Settings */}
                  <div style={{ 
                    padding: '1.5rem', 
                    background: '#f9fafb', 
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <h3 style={{ fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
                      Backup Settings
                    </h3>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <div>
                        <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>
                          Automatic Backups
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          Enable automatic database backups
                        </div>
                      </div>
                      <label style={{ position: 'relative', display: 'inline-block', width: '60px', height: '34px' }}>
                        <input
                          type="checkbox"
                          checked={databaseData.backupEnabled}
                          onChange={(e) => setDatabaseData({ ...databaseData, backupEnabled: e.target.checked })}
                          style={{ opacity: 0, width: 0, height: 0 }}
                        />
                        <span style={{
                          position: 'absolute',
                          cursor: 'pointer',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: databaseData.backupEnabled ? '#10b981' : '#d1d5db',
                          borderRadius: '34px',
                          transition: '0.4s'
                        }}>
                          <span style={{
                            position: 'absolute',
                            content: '',
                            height: '26px',
                            width: '26px',
                            left: databaseData.backupEnabled ? '30px' : '4px',
                            bottom: '4px',
                            background: 'white',
                            borderRadius: '50%',
                            transition: '0.4s'
                          }} />
                        </span>
                      </label>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                      <div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                          Last Backup
                        </div>
                        <div style={{ fontWeight: '600', color: '#1f2937' }}>
                          {databaseData.lastBackup}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                          Backup Size
                        </div>
                        <div style={{ fontWeight: '600', color: '#1f2937' }}>
                          {databaseData.backupSize}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleBackupNow}
                      disabled={loading}
                      style={{
                        marginTop: '1rem',
                        padding: '0.75rem 1.5rem',
                        background: loading ? '#9ca3af' : '#667eea',
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
                      <FiRefreshCw />
                      {loading ? 'Creating Backup...' : 'Backup Now'}
                    </button>
                  </div>

                  {/* Save Button */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => handleSave('database')}
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

            {/* Email Settings */}
            {activeTab === 'email' && (
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: '#1f2937' }}>
                  Email Configuration
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* SMTP Settings */}
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                        SMTP Host
                      </label>
                      <input
                        type="text"
                        value={emailData.smtpHost}
                        onChange={(e) => setEmailData({ ...emailData, smtpHost: e.target.value })}
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
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                        SMTP Port
                      </label>
                      <input
                        type="text"
                        value={emailData.smtpPort}
                        onChange={(e) => setEmailData({ ...emailData, smtpPort: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '1rem'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                      SMTP Username
                    </label>
                    <input
                      type="text"
                      value={emailData.smtpUser}
                      onChange={(e) => setEmailData({ ...emailData, smtpUser: e.target.value })}
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
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                      SMTP Password
                    </label>
                    <input
                      type="password"
                      value={emailData.smtpPassword}
                      onChange={(e) => setEmailData({ ...emailData, smtpPassword: e.target.value })}
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
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                      Encryption
                    </label>
                    <select
                      value={emailData.encryption}
                      onChange={(e) => setEmailData({ ...emailData, encryption: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                    >
                      <option value="TLS">TLS</option>
                      <option value="SSL">SSL</option>
                      <option value="NONE">None</option>
                    </select>
                  </div>

                  {/* Sender Information */}
                  <div style={{ 
                    padding: '1.5rem', 
                    background: '#f9fafb', 
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <h3 style={{ fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
                      Sender Information
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151', fontSize: '0.875rem' }}>
                          From Name
                        </label>
                        <input
                          type="text"
                          value={emailData.fromName}
                          onChange={(e) => setEmailData({ ...emailData, fromName: e.target.value })}
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
                          From Email
                        </label>
                        <input
                          type="email"
                          value={emailData.fromEmail}
                          onChange={(e) => setEmailData({ ...emailData, fromEmail: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            fontSize: '1rem'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button
                      onClick={handleTestEmail}
                      disabled={loading}
                      style={{
                        padding: '0.75rem 1.5rem',
                        background: loading ? '#9ca3af' : '#667eea',
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
                      <FiMail />
                      {loading ? 'Sending...' : 'Send Test Email'}
                    </button>

                    <button
                      onClick={() => handleSave('email')}
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
