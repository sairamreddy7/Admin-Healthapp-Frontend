// src/pages/TestResults.jsx
import { useState, useEffect } from 'react';
import { FiFileText, FiRefreshCw, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { testResultService } from '../services/userService';

export default function TestResults() {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15); // 15 test results per page

  useEffect(() => {
    const loadTestResults = async (isRefresh = false) => {
      try {
        isRefresh ? setRefreshing(true) : setLoading(true);
        const response = await testResultService.getAll({ limit: 1000 });

        // Normalized by service: { data: { testResults: [...] } }
        const testResultsData =
          response.data?.testResults ||
          response.data?.data?.testResults ||
          [];

        setTestResults(Array.isArray(testResultsData) ? testResultsData : []);

        // Debug: Log test results structure
        if (testResultsData.length > 0) {
          console.log('Sample test result:', testResultsData[0]);
          console.log('Available fields:', Object.keys(testResultsData[0]));
        }
      } catch (err) {
        console.error('Error loading test results:', err);
        setTestResults([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

    loadTestResults();
    const interval = setInterval(() => loadTestResults(true), 30000);
    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = async () => {
    try {
      setRefreshing(true);
      const response = await testResultService.getAll({ limit: 1000 });
      const testResultsData =
        response.data?.testResults ||
        response.data?.data?.testResults ||
        [];

      setTestResults(Array.isArray(testResultsData) ? testResultsData : []);
    } catch (err) {
      console.error('Error refreshing test results:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return { bg: '#d1fae5', color: '#065f46' };
      case 'PENDING':
        return { bg: '#fef3c7', color: '#92400e' };
      case 'REVIEWED':
        return { bg: '#dbeafe', color: '#1e40af' };
      default:
        return { bg: '#f3f4f6', color: '#374151' };
    }
  };

  const safeTestResults = Array.isArray(testResults) ? testResults : [];

  const filteredTestResults = safeTestResults.filter((t) => {
    const term = searchTerm.toLowerCase();

    const matchesSearch =
      (t.testName && t.testName.toLowerCase().includes(term)) ||
      (t.testType && t.testType.toLowerCase().includes(term)) ||
      (t.patient?.firstName &&
        t.patient.firstName.toLowerCase().includes(term)) ||
      (t.patient?.lastName &&
        t.patient.lastName.toLowerCase().includes(term)) ||
      (t.diagnosis && t.diagnosis.toLowerCase().includes(term));

    const matchesStatus =
      statusFilter === 'ALL' || (t.status && t.status === statusFilter);

    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages =
    filteredTestResults.length > 0
      ? Math.ceil(filteredTestResults.length / itemsPerPage)
      : 1;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTestResults = filteredTestResults.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #667eea',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem',
            }}
          ></div>
          <p style={{ color: '#666' }}>Loading test results...</p>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }}`}</style>
      </div>
    );
  }

  return (
    <div>
      {/* Header + refresh */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h1
            style={{
              marginBottom: '0.5rem',
              fontSize: '2rem',
              fontWeight: '700',
            }}
          >
            Test Results Management
          </h1>
          <p style={{ color: '#666' }}>
            Monitor all laboratory and diagnostic test results
          </p>
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
          }}
        >
          <FiRefreshCw
            style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }}
          />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Filters */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ flex: '1 1 300px', minWidth: '250px' }}>
          <input
            type="text"
            placeholder="🔍 Search by test name, type, patient, or diagnosis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '1rem',
            }}
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
            minWidth: '150px',
          }}
        >
          <option value="ALL">All Status</option>
          <option value="COMPLETED">Completed</option>
          <option value="PENDING">Pending</option>
          <option value="REVIEWED">Reviewed</option>
        </select>
      </div>

      {/* Empty state */}
      {filteredTestResults.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '3rem',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
        >
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧪</p>
          <p
            style={{
              color: '#9ca3af',
              fontSize: '1.1rem',
              marginBottom: '0.5rem',
            }}
          >
            No test results found
          </p>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
            {statusFilter !== 'ALL' || searchTerm
              ? 'Try adjusting your filters to see results.'
              : 'There are no test results in the system yet.'}
          </p>
        </div>
      ) : (
        <>
          {/* Table */}
          <div
            style={{
              background: 'white',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead
                style={{
                  background: '#f9fafb',
                  borderBottom: '2px solid #e5e7eb',
                }}
              >
                <tr>
                  <th
                    style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                    }}
                  >
                    Test Name
                  </th>
                  <th
                    style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                    }}
                  >
                    Patient
                  </th>
                  <th
                    style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                    }}
                  >
                    Type
                  </th>
                  <th
                    style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      padding: '1rem',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                    }}
                  >
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedTestResults.map((test) => {
                  const statusStyle = getStatusColor(test.status);
                  const displayName =
                    test.testName || test.diagnosis || 'Lab Test';

                  const displayDate =
                    test.testDate ||
                    test.visitDate ||
                    test.resultDate ||
                    test.date ||
                    test.createdAt ||
                    test.created_at ||
                    test.updatedAt ||
                    test.updated_at ||
                    null;

                  return (
                    <tr
                      key={test.id}
                      style={{
                        borderTop: '1px solid #e5e7eb',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = '#f9fafb')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = 'white')
                      }
                    >
                      <td style={{ padding: '1rem' }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                          }}
                        >
                          <FiFileText style={{ color: '#6b7280' }} />
                          <span style={{ fontWeight: '600' }}>{displayName}</span>
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div>
                          {test.patient?.firstName} {test.patient?.lastName}
                        </div>
                        <div
                          style={{
                            fontSize: '0.875rem',
                            color: '#6b7280',
                          }}
                        >
                          ID: {test.patientId}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: '1rem',
                          fontSize: '0.875rem',
                          color: '#6b7280',
                        }}
                      >
                        {test.testType || 'General'}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span
                          style={{
                            padding: '0.25rem 0.75rem',
                            background: statusStyle.bg,
                            color: statusStyle.color,
                            borderRadius: '12px',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            display: 'inline-block',
                          }}
                        >
                          {test.status || 'PENDING'}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: '1rem',
                          fontSize: '0.875rem',
                          color: '#6b7280',
                        }}
                      >
                        {displayDate
                          ? new Date(displayDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })
                          : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div
              style={{
                marginTop: '2rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.5rem',
                flexWrap: 'wrap',
              }}
            >
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
                }}
              >
                <FiChevronLeft />
                Previous
              </button>

              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  flexWrap: 'wrap',
                }}
              >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      style={{
                        padding: '0.5rem 1rem',
                        background:
                          currentPage === page ? '#667eea' : 'white',
                        color: currentPage === page ? 'white' : '#374151',
                        border:
                          currentPage === page
                            ? 'none'
                            : '1px solid #e5e7eb',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        minWidth: '40px',
                      }}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                style={{
                  padding: '0.5rem 1rem',
                  background:
                    currentPage === totalPages ? '#f3f4f6' : '#667eea',
                  color: currentPage === totalPages ? '#9ca3af' : 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor:
                    currentPage === totalPages ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontWeight: '600',
                }}
              >
                Next
                <FiChevronRight />
              </button>
            </div>
          )}

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              Showing {filteredTestResults.length === 0 ? 0 : startIndex + 1}-
              {Math.min(endIndex, filteredTestResults.length)} of{' '}
              {filteredTestResults.length} test results
              {safeTestResults.length !== filteredTestResults.length &&
                ` (filtered from ${safeTestResults.length} total)`}
            </p>
          </div>
        </>
      )}

      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }}`}</style>
    </div>
  );
}