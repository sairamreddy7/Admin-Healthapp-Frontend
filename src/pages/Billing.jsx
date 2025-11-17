import { useState, useEffect } from 'react';
import { FiDollarSign, FiX, FiRefreshCw, FiFilter, FiDownload } from 'react-icons/fi';
import { billingService } from '../services/userService';

export default function Billing() {
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [monthFilter, setMonthFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const loadData = async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }
        
        // Fetch real data from API
        const params = { limit: 1000 };
        const [invoicesResponse, statsResponse] = await Promise.all([
          billingService.getAllInvoices(params),
          billingService.getStats()
        ]);
        
        const invoicesData = invoicesResponse.data?.data || [];
        
        // Use real data from API
        setInvoices(invoicesData);
        setStats(statsResponse.data?.data);
        setLastUpdated(new Date());
      } catch (err) {
        console.error('Error loading billing data:', err);
        setInvoices([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

    loadData();

    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing billing data...');
      loadData(true);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = async () => {
    try {
      setRefreshing(true);
      const params = { limit: 1000 };
      const [invoicesResponse, statsResponse] = await Promise.all([
        billingService.getAllInvoices(params),
        billingService.getStats()
      ]);
      setInvoices(invoicesResponse.data?.data || []);
      setStats(statsResponse.data?.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error refreshing billing data:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleInvoiceClick = (invoice) => {
    setSelectedInvoice(invoice);
    setShowDetailModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PAID':
        return { bg: '#d1fae5', color: '#065f46' };
      case 'PENDING':
        return { bg: '#fef3c7', color: '#92400e' };
      case 'OVERDUE':
        return { bg: '#fee2e2', color: '#991b1b' };
      default:
        return { bg: '#f3f4f6', color: '#374151' };
    }
  };

  // Get unique months from invoices
  const availableMonths = [...new Set(invoices.map(inv => {
    const date = new Date(inv.createdAt);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }))].sort().reverse();

  const filteredInvoices = invoices.filter(inv => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = (
      inv.id?.toString().toLowerCase().includes(searchLower) ||
      inv.patient?.firstName?.toLowerCase().includes(searchLower) ||
      inv.patient?.lastName?.toLowerCase().includes(searchLower) ||
      inv.description?.toLowerCase().includes(searchLower)
    );
    
    const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
    
    const invDate = new Date(inv.createdAt);
    const invMonth = `${invDate.getFullYear()}-${String(invDate.getMonth() + 1).padStart(2, '0')}`;
    const matchesMonth = monthFilter === 'ALL' || invMonth === monthFilter;
    
    return matchesSearch && matchesStatus && matchesMonth;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedInvoices = filteredInvoices.slice(startIndex, endIndex);

  // Get month name from YYYY-MM format
  const getMonthName = (monthStr) => {
    if (monthStr === 'ALL') return 'All Time';
    const [year, month] = monthStr.split('-');
    const date = new Date(year, parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

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
          <p style={{ color: '#666' }}>Loading billing data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ marginBottom: '0.5rem', fontSize: '2rem', fontWeight: '700' }}>Billing & Payments</h1>
            <p style={{ color: '#666' }}>Monitor invoices and financial transactions</p>
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

        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '1.5rem', borderRadius: '12px', color: 'white' }}>
              <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem', opacity: 0.9 }}>Total Revenue</div>
              <div style={{ fontSize: '2rem', fontWeight: '700' }}>${stats.totalRevenue}</div>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', padding: '1.5rem', borderRadius: '12px', color: 'white' }}>
              <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem', opacity: 0.9 }}>Pending Amount</div>
              <div style={{ fontSize: '2rem', fontWeight: '700' }}>${stats.pendingAmount}</div>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', padding: '1.5rem', borderRadius: '12px', color: 'white' }}>
              <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem', opacity: 0.9 }}>This Month</div>
              <div style={{ fontSize: '2rem', fontWeight: '700' }}>${stats.thisMonthRevenue}</div>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', padding: '1.5rem', borderRadius: '12px', color: 'white' }}>
              <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem', opacity: 0.9 }}>Total Invoices</div>
              <div style={{ fontSize: '2rem', fontWeight: '700' }}>{stats.total}</div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px', minWidth: '250px' }}>
            <input
              type="text"
              placeholder="🔍 Search by invoice ID, patient name, or description..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiFilter style={{ color: '#6b7280' }} />
            <select
              value={monthFilter}
              onChange={(e) => {
                setMonthFilter(e.target.value);
                setCurrentPage(1); // Reset to first page on filter
              }}
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
              <option value="ALL">All Months</option>
              {availableMonths.map(month => (
                <option key={month} value={month}>
                  {getMonthName(month)}
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1); // Reset to first page on filter
              }}
              style={{
                padding: '0.75rem 1rem',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '1rem',
                cursor: 'pointer',
                background: 'white'
              }}
            >
              <option value="ALL">All Status</option>
              <option value="PAID">Paid</option>
              <option value="PENDING">Pending</option>
              <option value="OVERDUE">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      {filteredInvoices.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>💰</p>
          <p style={{ color: '#9ca3af', fontSize: '1.1rem', marginBottom: '0.5rem' }}>No invoices found</p>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
            {statusFilter !== 'ALL' || searchTerm || monthFilter !== 'ALL'
              ? 'Try adjusting your filters to see results.'
              : 'There are no billing invoices in the system yet.'}
          </p>
        </div>
      ) : (
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
              <tr>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Invoice ID</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Patient</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Description</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Amount</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {paginatedInvoices.map((invoice) => {
                const statusStyle = getStatusColor(invoice.status);
                return (
                  <tr 
                    key={invoice.id}
                    onClick={() => handleInvoiceClick(invoice)}
                    style={{ 
                      borderTop: '1px solid #e5e7eb', 
                      transition: 'background 0.2s',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                  >
                    <td style={{ padding: '1rem', fontWeight: '600', color: '#667eea' }}>
                      #{invoice.id}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: '600' }}>
                        {invoice.patient?.firstName} {invoice.patient?.lastName}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        ID: {invoice.patientId}
                      </div>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#374151' }}>
                      {invoice.description || 'Medical Services'}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <FiDollarSign style={{ color: '#10b981' }} />
                        <span style={{ fontWeight: '700', fontSize: '1.1rem', color: '#10b981' }}>
                          {parseFloat(invoice.amount || 0).toFixed(2)}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        background: statusStyle.bg,
                        color: statusStyle.color,
                        borderRadius: '12px',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        display: 'inline-block'
                      }}>
                        {invoice.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                      {new Date(invoice.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      <div style={{ 
        marginTop: '1.5rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        background: 'white',
        padding: '1rem',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
          Showing {startIndex + 1}-{Math.min(endIndex, filteredInvoices.length)} of {filteredInvoices.length} invoices
          {filteredInvoices.length !== invoices.length && ` (filtered from ${invoices.length} total)`}
        </div>
        
        {totalPages > 1 && (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              style={{
                padding: '0.5rem 1rem',
                background: currentPage === 1 ? '#f3f4f6' : '#667eea',
                color: currentPage === 1 ? '#9ca3af' : 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (currentPage !== 1) e.target.style.background = '#5a67d8';
              }}
              onMouseLeave={(e) => {
                if (currentPage !== 1) e.target.style.background = '#667eea';
              }}
            >
              ← Previous
            </button>
            
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = idx + 1;
                } else if (currentPage <= 3) {
                  pageNum = idx + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + idx;
                } else {
                  pageNum = currentPage - 2 + idx;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    style={{
                      padding: '0.5rem 0.75rem',
                      background: currentPage === pageNum ? '#667eea' : 'white',
                      color: currentPage === pageNum ? 'white' : '#374151',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      fontWeight: currentPage === pageNum ? '600' : '400',
                      minWidth: '2.5rem',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (currentPage !== pageNum) {
                        e.target.style.background = '#f3f4f6';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentPage !== pageNum) {
                        e.target.style.background = 'white';
                      }
                    }}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              style={{
                padding: '0.5rem 1rem',
                background: currentPage === totalPages ? '#f3f4f6' : '#667eea',
                color: currentPage === totalPages ? '#9ca3af' : 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (currentPage !== totalPages) e.target.style.background = '#5a67d8';
              }}
              onMouseLeave={(e) => {
                if (currentPage !== totalPages) e.target.style.background = '#667eea';
              }}
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {showDetailModal && selectedInvoice && (
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
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>Invoice Details</h2>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedInvoice(null);
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem' }}>INVOICE ID</h3>
                  <p style={{ fontSize: '1.25rem', fontWeight: '700', color: '#667eea' }}>#{selectedInvoice.id}</p>
                </div>
                <span style={{
                  padding: '0.5rem 1rem',
                  background: getStatusColor(selectedInvoice.status).bg,
                  color: getStatusColor(selectedInvoice.status).color,
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}>
                  {selectedInvoice.status}
                </span>
              </div>

              <div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem' }}>PATIENT</h3>
                <p style={{ fontSize: '1rem', color: '#1f2937', fontWeight: '600' }}>
                  {selectedInvoice.patient?.firstName} {selectedInvoice.patient?.lastName}
                </p>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  Patient ID: {selectedInvoice.patientId}
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem' }}>DESCRIPTION</h3>
                <p style={{ fontSize: '1rem', color: '#1f2937' }}>
                  {selectedInvoice.description || 'Medical Services'}
                </p>
              </div>

              <div style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '12px' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem' }}>AMOUNT</h3>
                <p style={{ fontSize: '2.5rem', fontWeight: '700', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FiDollarSign />
                  {parseFloat(selectedInvoice.amount || 0).toFixed(2)}
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem' }}>DATE ISSUED</h3>
                <p style={{ fontSize: '1rem', color: '#1f2937' }}>
                  {new Date(selectedInvoice.createdAt).toLocaleString()}
                </p>
              </div>

              {selectedInvoice.paidAt && (
                <div>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem' }}>DATE PAID</h3>
                  <p style={{ fontSize: '1rem', color: '#1f2937' }}>
                    {new Date(selectedInvoice.paidAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
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
