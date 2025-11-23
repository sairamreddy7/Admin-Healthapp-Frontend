import { useState, useEffect, useCallback } from 'react';
import { FiPlus, FiX, FiRefreshCw } from 'react-icons/fi';
import { patientService } from '../services/userService';
import api from '../services/api';

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    dateOfBirth: '',
    gender: 'Male',
    phoneNumber: '',
    address: ''
  });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const loadPatients = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const response = await patientService.getAll();
      console.log('Patients API response:', response.data);
      // API returns nested structure: {success: true, data: {patients: [...]}}
      const patientsData = response.data?.data?.patients || response.data?.patients || [];
      setPatients(patientsData);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error loading patients:', err);
      setPatients([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadPatients();

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing patients...');
      loadPatients(true);
    }, 30000);

    return () => clearInterval(interval);
  }, [loadPatients]);

  const handleManualRefresh = () => {
    loadPatients(true);
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    try {
      // Use the username from the form (or generate from email if empty)
      const username = formData.username || formData.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');

      // Step 1: Register the user first to get userId
      const registerResponse = await api.post('/auth/register', {
        username: username,
        email: formData.email,
        password: formData.password,
        role: 'PATIENT',
        firstName: formData.firstName,
        lastName: formData.lastName
      });

      console.log('User registered:', registerResponse.data);
      const userId = registerResponse.data?.data?.userId || registerResponse.data?.userId;

      if (!userId) {
        throw new Error('Failed to get user ID from registration');
      }

      // Step 2: Create patient profile with the userId
      const patientData = {
        userId: userId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        phoneNumber: formData.phoneNumber,
        address: formData.address || ''
      };

      await patientService.create(patientData);

      setShowAddModal(false);
      setFormData({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        dateOfBirth: '',
        gender: 'Male',
        phoneNumber: '',
        address: ''
      });
      alert('Patient added successfully!');
      loadPatients(true);
    } catch (err) {
      console.error('Error creating patient:', err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to add patient';
      setFormError(errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phoneNumber?.includes(searchTerm)
  );

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
          <p style={{ color: '#666' }}>Loading patients...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h1 style={{ marginBottom: '0.5rem', fontSize: '2rem', fontWeight: '700' }}>Patient Management</h1>
            <p style={{ color: '#666' }}>Manage patient profiles and medical records</p>
            {lastUpdated && (
              <p style={{ color: '#999', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
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
            <button
              onClick={() => setShowAddModal(true)}
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
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = '#059669'}
              onMouseLeave={(e) => e.target.style.background = '#10b981'}
            >
              <FiPlus style={{ fontSize: '1.25rem' }} />
              Add Patient
            </button>
          </div>
        </div>

        <div style={{
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          marginBottom: '1rem'
        }}>
          <p style={{ fontSize: '0.875rem', color: '#1e40af', margin: 0 }}>
            ℹ️ <strong>Note:</strong> This page shows only patients with complete profiles. Users with PATIENT role but without patient profiles will appear in User Management until they complete their profile.
          </p>
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="🔍 Search by name, email, username, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '1rem'
          }}
        />
      </div>

      {filteredPatients.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏥</p>
          <p style={{ color: '#9ca3af', fontSize: '1.1rem' }}>No patients found</p>
        </div>
      ) : (
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
              <tr>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Patient</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Contact</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Date of Birth</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Address</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr
                  key={patient.id}
                  style={{ borderTop: '1px solid #e5e7eb', transition: 'background 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '1rem',
                        fontWeight: '700'
                      }}>
                        {(patient.firstName?.[0] || 'P').toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                          {patient.firstName} {patient.lastName}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          @{patient.user?.username}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontSize: '0.875rem' }}>
                      <div style={{ marginBottom: '0.25rem', color: '#374151' }}>
                        📧 {patient.user?.email}
                      </div>
                      <div style={{ color: '#6b7280' }}>
                        📞 {patient.phoneNumber || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                    {patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : 'N/A'}
                  </td>
                  <td style={{ padding: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                    {patient.address || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
          Showing {filteredPatients.length} of {patients.length} patients • Auto-refreshes every 30 seconds
        </p>
      </div>

      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>Add New Patient</h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setFormError('');
                  setFormData({ firstName: '', lastName: '', email: '', password: '', dateOfBirth: '', phoneNumber: '', address: '' });
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#6b7280',
                  padding: '0.25rem'
                }}
              >
                <FiX />
              </button>
            </div>

            {formError && (
              <div style={{
                padding: '0.75rem',
                background: '#fee2e2',
                color: '#991b1b',
                borderRadius: '8px',
                marginBottom: '1rem',
                fontSize: '0.875rem'
              }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleAddPatient}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                    Username *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                    placeholder="johndoe"
                  />
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                    Unique username for login (lowercase letters and numbers only)
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                      placeholder="John"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '1rem'
                      }}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                    placeholder="patient@example.com"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                    placeholder="Enter password"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
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
                    Gender *
                  </label>
                  <select
                    required
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                    Address
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      minHeight: '80px',
                      resize: 'vertical'
                    }}
                    placeholder="123 Main St, City, State"
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setFormError('');
                      setFormData({ firstName: '', lastName: '', email: '', password: '', dateOfBirth: '', phoneNumber: '', address: '' });
                    }}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: '#f3f4f6',
                      color: '#374151',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '1rem'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: formLoading ? '#9ca3af' : '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: formLoading ? 'not-allowed' : 'pointer',
                      fontSize: '1rem'
                    }}
                  >
                    {formLoading ? 'Adding...' : 'Add Patient'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
