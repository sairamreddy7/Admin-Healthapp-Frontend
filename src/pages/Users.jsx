import { useState, useEffect, useCallback } from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import { userService, patientService } from '../services/userService';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadUsers = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const response = await userService.getAll();
      setUsers(response.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing users...');
      loadUsers(true);
    }, 30000);

    return () => clearInterval(interval);
  }, [loadUsers]);

  const handleManualRefresh = () => {
    loadUsers(true);
  };

  const handleDelete = async (user) => {
    // Only allow deleting patients
    if (user.role !== 'PATIENT') {
      alert('Only patient accounts can be deleted. Doctor and admin accounts cannot be removed.');
      return;
    }

    if (!confirm(`Are you sure you want to delete patient ${user.email}? This action cannot be undone.`)) return;

    try {
      // First, get all patients to find the patient record for this user
      const patientsResponse = await patientService.getAll();
      const patients = patientsResponse.data?.data?.patients || patientsResponse.data?.patients || [];

      // Find the patient record that matches this userId
      const patientRecord = patients.find(p => p.userId === user.id);

      if (!patientRecord) {
        alert('Patient record not found. This user may not have a complete patient profile.');
        return;
      }

      // Use the patient's ID (not userId) for deletion
      await patientService.delete(patientRecord.id);
      alert('Patient deleted successfully');
      loadUsers(true);
    } catch (err) {
      console.error('Error deleting patient:', err);
      alert(err.response?.data?.message || err.response?.data?.error || 'Error deleting patient. Please try again.');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'ALL' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const patientRoleCount = users.filter(u => u.role === 'PATIENT').length;

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: '#666' }}>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h1 style={{ marginBottom: '0.5rem', fontSize: '2rem', fontWeight: '700' }}>User Management</h1>
            <p style={{ color: '#666' }}>Manage system users, roles, and permissions</p>
            {lastUpdated && (
              <p style={{ color: '#999', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
          <button
            onClick={handleManualRefresh}
            disabled={refreshing}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: refreshing ? '#9ca3af' : '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: refreshing ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!refreshing) e.target.style.background = '#5a67d8';
            }}
            onMouseLeave={(e) => {
              if (!refreshing) e.target.style.background = '#667eea';
            }}
          >
            <FiRefreshCw style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {patientRoleCount > 0 && (
          <div style={{
            background: '#fef3c7',
            border: '1px solid #fcd34d',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            marginBottom: '1rem'
          }}>
            <p style={{ fontSize: '0.875rem', color: '#92400e', margin: 0 }}>
              ℹ️ <strong>Patient Roles vs Patient Profiles:</strong> There are <strong>{patientRoleCount} users with PATIENT role</strong> in the system. Some may not have complete patient profiles yet. Check the Patient Management page to see users with complete profiles. Users without patient profiles need to complete their registration.
            </p>
          </div>
        )}
      </div>

      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="🔍 Search by email or username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            minWidth: '250px',
            padding: '0.75rem 1rem',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '1rem'
          }}
        />
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          style={{
            padding: '0.75rem 1rem',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '1rem',
            background: 'white',
            cursor: 'pointer'
          }}
        >
          <option value="ALL">All Roles ({users.length})</option>
          <option value="ADMIN">Admin ({users.filter(u => u.role === 'ADMIN').length})</option>
          <option value="DOCTOR">Doctor ({users.filter(u => u.role === 'DOCTOR').length})</option>
          <option value="PATIENT">Patient ({patientRoleCount})</option>
        </select>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
            <tr>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>User</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Role</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Joined</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map(user => (
                <tr key={user.id} style={{ borderTop: '1px solid #e5e7eb', transition: 'background 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{user.email}</div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>@{user.username}</div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      background: user.role === 'ADMIN' ? '#fef3c7' : user.role === 'DOCTOR' ? '#dbeafe' : '#d1fae5',
                      color: user.role === 'ADMIN' ? '#92400e' : user.role === 'DOCTOR' ? '#1e40af' : '#065f46'
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      background: user.isActive ? '#d1fae5' : '#fee2e2',
                      color: user.isActive ? '#065f46' : '#991b1b'
                    }}>
                      {user.isActive ? '✓ Active' : '✗ Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {user.role === 'PATIENT' ? (
                      <button
                        onClick={() => handleDelete(user)}
                        style={{
                          padding: '0.5rem 1rem',
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#dc2626'}
                        onMouseLeave={(e) => e.target.style.background = '#ef4444'}
                      >
                        🗑️ Delete
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.875rem', color: '#9ca3af', fontStyle: 'italic' }}>
                        {user.role === 'DOCTOR' ? 'Cannot delete doctors' : 'Cannot delete admins'}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
          Showing {filteredUsers.length} of {users.length} users • Auto-refreshes every 30 seconds
        </p>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
