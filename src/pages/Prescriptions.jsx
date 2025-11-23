import { useState, useEffect } from 'react';
import { FiPackage, FiRefreshCw, FiChevronLeft, FiChevronRight, FiInfo } from 'react-icons/fi';
import { prescriptionService, userService, doctorService } from '../services/userService';

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    const loadPrescriptions = async (isRefresh = false) => {
      try {
        isRefresh ? setRefreshing(true) : setLoading(true);
        const response = await prescriptionService.getAll({ limit: 1000 });

        // Handle different response formats
        let prescriptionsData = response.data?.data?.prescriptions ||
          response.data?.prescriptions ||
          response.data?.data ||
          response.data ||
          [];

        // Ensure it's an array
        if (!Array.isArray(prescriptionsData)) {
          prescriptionsData = [];
        }

        console.log('Loaded prescriptions:', prescriptionsData);

        // Log first prescription to see structure
        if (prescriptionsData.length > 0) {
          console.log('Sample prescription structure:', prescriptionsData[0]);
          console.log('Available fields:', Object.keys(prescriptionsData[0]));
        }

        // Just use the prescription data as-is since enrichment requires backend permissions
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

      let prescriptionsData = response.data?.data?.prescriptions ||
        response.data?.prescriptions ||
        response.data?.data ||
        response.data ||
        [];

      if (!Array.isArray(prescriptionsData)) {
        prescriptionsData = [];
      }

      console.log('Refreshed prescriptions:', prescriptionsData);
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

  const totalPages = Math.ceil(filteredPrescriptions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPrescriptions = filteredPrescriptions.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
        return { bg: '#d1fae5', color: '#065f46' };
      case 'COMPLETED':
        return { bg: '#dbeafe', color: '#1e40af' };
      case 'CANCELLED':
        return { bg: '#fee2e2', color: '#991b1b' };
      default:
        return { bg: '#f3f4f6', color: '#374151' };
    }
  };

  const handleViewDetails = (prescription) => {
    setSelectedPrescription(prescription);
    setShowDetailModal(true);
  };

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
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ marginBottom: '0.5rem', fontSize: '2rem', fontWeight: '700' }}>Prescriptions Management</h1>
            <p style={{ color: '#666' }}>Monitor all prescriptions and medications</p>
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
            onMouseEnter={(e) => { if (!refreshing) e.target.style.background = '#5a67d8'; }}
            onMouseLeave={(e) => { if (!refreshing) e.target.style.background = '#667eea'; }}
          >
            <FiRefreshCw style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '1.5rem', borderRadius: '12px', color: 'white' }}>
            <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem', opacity: 0.9 }}>Total Prescriptions</div>
            <div style={{ fontSize: '2rem', fontWeight: '700' }}>{prescriptions.length}</div>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', padding: '1.5rem', borderRadius: '12px', color: 'white' }}>
            <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem', opacity: 0.9 }}>Active</div>
            <div style={{ fontSize: '2rem', fontWeight: '700' }}>
              {prescriptions.filter(p => p.status?.toUpperCase() === 'ACTIVE').length}
            </div>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', padding: '1.5rem', borderRadius: '12px', color: 'white' }}>
            <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem', opacity: 0.9 }}>Completed</div>
            <div style={{ fontSize: '2rem', fontWeight: '700' }}>
              {prescriptions.filter(p => p.status?.toUpperCase() === 'COMPLETED').length}
            </div>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', padding: '1.5rem', borderRadius: '12px', color: 'white' }}>
            <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem', opacity: 0.9 }}>Cancelled</div>
            <div style={{ fontSize: '2rem', fontWeight: '700' }}>
              {prescriptions.filter(p => p.status?.toUpperCase() === 'CANCELLED').length}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
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

      {/* Prescriptions Grid or Empty State */}
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
            {paginatedPrescriptions.map((prescription) => {
              const statusStyle = getStatusColor(prescription.status);
              return (
                <div
                  key={prescription.id}
                  style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleViewDetails(prescription)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '1.5rem'
                    }}>
                      <FiPackage />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.25rem' }}>
                        {prescription.medicationName || 'Unknown Medication'}
                      </h3>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        background: statusStyle.bg,
                        color: statusStyle.color,
                        borderRadius: '12px',
                        fontSize: '0.875rem',
                        fontWeight: '600'
                      }}>
                        {prescription.status || 'UNKNOWN'}
                      </span>
                    </div>
                  </div>
                  <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>�‍⚕️ Doctor:</span>
                      <span style={{ fontWeight: '600', color: '#374151', fontSize: '0.875rem' }}>
                        {prescription.doctorName || 'Not assigned'}
                      </span>
                    </div>
                    {prescription.doctorSpecialization && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>🏥 Specialization:</span>
                        <span style={{ fontWeight: '600', color: '#374151', fontSize: '0.875rem' }}>
                          {prescription.doctorSpecialization}
                        </span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>💊 Dosage:</span>
                      <span style={{ fontWeight: '600', color: '#374151', fontSize: '0.875rem' }}>{prescription.dosage || 'N/A'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>🔢 Frequency:</span>
                      <span style={{ fontWeight: '600', color: '#374151', fontSize: '0.875rem' }}>{prescription.frequency || 'N/A'}</span>
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
                  </div>
                </div>
              );
            })}
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
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => { if (currentPage !== 1) e.target.style.background = '#5a67d8'; }}
                onMouseLeave={(e) => { if (currentPage !== 1) e.target.style.background = '#667eea'; }}
              >
                <FiChevronLeft />
                Previous
              </button>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      style={{
                        padding: '0.5rem 1rem',
                        background: currentPage === pageNum ? '#667eea' : 'white',
                        color: currentPage === pageNum ? 'white' : '#374151',
                        border: currentPage === pageNum ? 'none' : '1px solid #e5e7eb',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        minWidth: '40px',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        if (currentPage !== pageNum) e.target.style.background = '#f3f4f6';
                      }}
                      onMouseLeave={(e) => {
                        if (currentPage !== pageNum) e.target.style.background = 'white';
                      }}
                    >
                      {pageNum}
                    </button>
                  );
                })}
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
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => { if (currentPage !== totalPages) e.target.style.background = '#5a67d8'; }}
                onMouseLeave={(e) => { if (currentPage !== totalPages) e.target.style.background = '#667eea'; }}
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

      {/* Detail Modal */}
      {showDetailModal && selectedPrescription && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
          }}
          onClick={() => setShowDetailModal(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              padding: '2rem',
              borderBottom: '1px solid #e5e7eb',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: '16px 16px 0 0'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                Prescription Details
              </h2>
              <p style={{ opacity: 0.9 }}>Complete medication information</p>
            </div>

            <div style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Medication */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem' }}>
                    💊 Medication Name
                  </label>
                  <div style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>
                    {selectedPrescription.medicationName || 'N/A'}
                  </div>
                </div>

                {/* Doctor */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem' }}>
                    👨‍⚕️ Prescribing Doctor
                  </label>
                  <div style={{ fontSize: '1rem', color: '#374151' }}>
                    {selectedPrescription.doctorName || 'Not assigned'}
                  </div>
                  {selectedPrescription.doctorSpecialization && (
                    <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                      {selectedPrescription.doctorSpecialization}
                    </div>
                  )}
                </div>

                {/* Dosage & Frequency */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem' }}>
                      💊 Dosage
                    </label>
                    <div style={{ fontSize: '1rem', color: '#374151' }}>
                      {selectedPrescription.dosage || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem' }}>
                      🔢 Frequency
                    </label>
                    <div style={{ fontSize: '1rem', color: '#374151' }}>
                      {selectedPrescription.frequency || 'N/A'}
                    </div>
                  </div>
                </div>

                {/* Duration & Status */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem' }}>
                      ⏱️ Duration
                    </label>
                    <div style={{ fontSize: '1rem', color: '#374151' }}>
                      {selectedPrescription.duration || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem' }}>
                      Status
                    </label>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      background: getStatusColor(selectedPrescription.status).bg,
                      color: getStatusColor(selectedPrescription.status).color,
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      display: 'inline-block'
                    }}>
                      {selectedPrescription.status || 'UNKNOWN'}
                    </span>
                  </div>
                </div>

                {/* Dates */}
                {selectedPrescription.prescribedDate && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem' }}>
                      📅 Prescribed Date
                    </label>
                    <div style={{ fontSize: '1rem', color: '#374151' }}>
                      {new Date(selectedPrescription.prescribedDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                )}

                {/* Instructions */}
                {selectedPrescription.instructions && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem' }}>
                      📝 Instructions
                    </label>
                    <div style={{
                      padding: '1rem',
                      background: '#f9fafb',
                      borderRadius: '8px',
                      fontSize: '0.9375rem',
                      color: '#374151',
                      lineHeight: '1.6'
                    }}>
                      {selectedPrescription.instructions}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowDetailModal(false)}
                style={{
                  marginTop: '2rem',
                  width: '100%',
                  padding: '0.75rem',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = '#5a67d8'}
                onMouseLeave={(e) => e.target.style.background = '#667eea'}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }}`}</style>
    </div>
  );
}
