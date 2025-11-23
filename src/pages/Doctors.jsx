import { useState, useEffect, useCallback } from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import { doctorService } from '../services/userService';

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadDoctors = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const response = await doctorService.getAll();
      console.log('Doctors API response:', response.data);
      const doctorsData = response.data?.data?.doctors || response.data?.doctors || response.data?.data || response.data || [];
      setDoctors(Array.isArray(doctorsData) ? doctorsData : []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error loading doctors:', err);
      setDoctors([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDoctors();

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing doctors...');
      loadDoctors(true);
    }, 30000);

    return () => clearInterval(interval);
  }, [loadDoctors]);

  const handleManualRefresh = () => {
    loadDoctors(true);
  };

  const filteredDoctors = doctors.filter(doctor => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (doctor.firstName?.toLowerCase() || '').includes(searchLower) ||
      (doctor.lastName?.toLowerCase() || '').includes(searchLower) ||
      (doctor.specialization?.toLowerCase() || '').includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>Loading doctors...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>
            Doctors Management
          </h1>
          <p style={{ color: '#6b7280' }}>
            View all registered doctors • Total: {doctors.length}
            {lastUpdated && <span style={{ marginLeft: '1rem', fontSize: '0.875rem' }}>
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={handleManualRefresh}
            disabled={refreshing}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: refreshing ? '#9ca3af' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: refreshing ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => !refreshing && (e.target.style.background = '#2563eb')}
            onMouseLeave={(e) => !refreshing && (e.target.style.background = '#3b82f6')}
          >
            <FiRefreshCw style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="🔍 Search by name or specialization..."
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

      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {filteredDoctors.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
              {searchTerm ? 'No doctors match your search' : 'No doctors found'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#f9fafb' }}>
                <tr>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Name</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Specialization</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Phone</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>License</th>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Experience</th>
                </tr>
              </thead>
              <tbody>
                {filteredDoctors.map((doctor, index) => (
                  <tr
                    key={doctor.id || index}
                    style={{
                      borderTop: '1px solid #e5e7eb'
                    }}
                  >
                    <td style={{ padding: '1rem' }}>
                      <div>
                        <div style={{ fontWeight: '600', color: '#1f2937' }}>
                          Dr. {doctor.firstName} {doctor.lastName}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {doctor.user?.email || doctor.email || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: '#374151' }}>
                      {doctor.specialization || 'N/A'}
                    </td>
                    <td style={{ padding: '1rem', color: '#374151' }}>
                      {doctor.phoneNumber || 'N/A'}
                    </td>
                    <td style={{ padding: '1rem', color: '#374151' }}>
                      {doctor.licenseNumber || 'N/A'}
                    </td>
                    <td style={{ padding: '1rem', color: '#374151' }}>
                      {doctor.yearsExperience ? `${doctor.yearsExperience} years` : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
