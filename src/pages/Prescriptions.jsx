import { useState, useEffect } from 'react';
import { FiPackage, FiRefreshCw, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { prescriptionService } from '../services/userService';

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12); // Show 12 prescriptions per page

  useEffect(() => {
    const loadPrescriptions = async (isRefresh = false) => {
      try {
        isRefresh ? setRefreshing(true) : setLoading(true);
        const response = await prescriptionService.getAll({ limit: 1000 });
        const prescriptionsData = response.data?.data?.prescriptions || response.data?.data || [];
        setPrescriptions(prescriptionsData);
      } catch (err) {
        console.error('Error loading prescriptions:', err);
        setPrescriptions([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

    loadPrescriptions();
    const interval = setInterval(() => loadPrescriptions(true), 30000);
    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = async () => {
    try {
      setRefreshing(true);
      const response = await prescriptionService.getAll({ limit: 1000 });
      const prescriptionsData = response.data?.data?.prescriptions || response.data?.data || [];
      setPrescriptions(prescriptionsData);
    } catch (err) {
      console.error('Error refreshing prescriptions:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const filteredPrescriptions = prescriptions.filter(p => {
    const matchesSearch = 
      p.medicationName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.patient?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.patient?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.doctor?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.doctor?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.dosage?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredPrescriptions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPrescriptions = filteredPrescriptions.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '50px', height: '50px', border: '4px solid #f3f3f3', borderTop: '4px solid #667eea', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
          <p style={{ color: '#666' }}>Loading prescriptions...</p>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }}`}</style>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.5rem', fontSize: '2rem', fontWeight: '700' }}>Prescriptions Management</h1>
          <p style={{ color: '#666' }}>Monitor all prescriptions and medications</p>
        </div>
        <button onClick={handleManualRefresh} disabled={refreshing} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: refreshing ? '#9ca3af' : '#667eea', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: refreshing ? 'not-allowed' : 'pointer' }}>
          <FiRefreshCw style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 300px', minWidth: '250px' }}>
          <input 
            type="text" 
            placeholder="🔍 Search by medication, patient, or doctor..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '1rem' }} 
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '0.75rem 1rem',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '1rem',
            cursor: 'pointer',
            background: 'white',
            minWidth: '150px'
          }}
        >
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {filteredPrescriptions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>💊</p>
          <p style={{ color: '#9ca3af', fontSize: '1.1rem', marginBottom: '0.5rem' }}>No prescriptions found</p>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
            {statusFilter !== 'ALL' || searchTerm
              ? 'Try adjusting your filters to see results.'
              : 'There are no prescriptions in the system yet.'}
          </p>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {paginatedPrescriptions.map((prescription) => (
            <div key={prescription.id} style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.3s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem' }}>
                  <FiPackage />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.25rem' }}>{prescription.medicationName}</h3>
                  <span style={{ padding: '0.25rem 0.75rem', background: '#dbeafe', color: '#1e40af', borderRadius: '12px', fontSize: '0.875rem', fontWeight: '600' }}>
                    {prescription.status}
                  </span>
                </div>
              </div>
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>👤 Patient:</span>
                  <span style={{ fontWeight: '600', color: '#374151', fontSize: '0.875rem' }}>{prescription.patient?.firstName} {prescription.patient?.lastName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>👨‍⚕️ Doctor:</span>
                  <span style={{ fontWeight: '600', color: '#374151', fontSize: '0.875rem' }}>
                    {prescription.doctor?.firstName && prescription.doctor?.lastName 
                      ? `Dr. ${prescription.doctor.firstName} ${prescription.doctor.lastName}`
                      : 'Not assigned'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>💊 Dosage:</span>
                  <span style={{ fontWeight: '600', color: '#374151', fontSize: '0.875rem' }}>{prescription.dosage}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>🔢 Frequency:</span>
                  <span style={{ fontWeight: '600', color: '#374151', fontSize: '0.875rem' }}>{prescription.frequency}</span>
                </div>
                {prescription.duration && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>⏱️ Duration:</span>
                    <span style={{ fontWeight: '600', color: '#374151', fontSize: '0.875rem' }}>{prescription.duration}</span>
                  </div>
                )}
                {prescription.prescribedDate && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>📅 Prescribed:</span>
                    <span style={{ fontWeight: '600', color: '#374151', fontSize: '0.875rem' }}>
                      {new Date(prescription.prescribedDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {prescription.instructions && (
                  <div style={{ marginTop: '0.5rem', padding: '0.75rem', background: '#f9fafb', borderRadius: '8px' }}>
                    <span style={{ color: '#6b7280', fontSize: '0.875rem', display: 'block', marginBottom: '0.25rem' }}>📝 Instructions:</span>
                    <span style={{ color: '#374151', fontSize: '0.875rem' }}>{prescription.instructions}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{
                padding: '0.5rem 1rem',
                background: currentPage === 1 ? '#f3f4f6' : '#667eea',
                color: currentPage === 1 ? '#9ca3af' : 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontWeight: '600'
              }}
            >
              <FiChevronLeft />
              Previous
            </button>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: currentPage === page ? '#667eea' : 'white',
                    color: currentPage === page ? 'white' : '#374151',
                    border: currentPage === page ? 'none' : '1px solid #e5e7eb',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    minWidth: '40px'
                  }}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{
                padding: '0.5rem 1rem',
                background: currentPage === totalPages ? '#f3f4f6' : '#667eea',
                color: currentPage === totalPages ? '#9ca3af' : 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontWeight: '600'
              }}
            >
              Next
              <FiChevronRight />
            </button>
          </div>
        )}

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            Showing {startIndex + 1}-{Math.min(endIndex, filteredPrescriptions.length)} of {filteredPrescriptions.length} prescriptions
            {prescriptions.length !== filteredPrescriptions.length && ` (filtered from ${prescriptions.length} total)`}
          </p>
        </div>
      </>
      )}

      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }}`}</style>
    </div>
  );
}
