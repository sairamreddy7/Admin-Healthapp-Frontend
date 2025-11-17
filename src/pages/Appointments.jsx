import { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiUser, FiX, FiRefreshCw, FiFilter } from 'react-icons/fi';
import { appointmentService } from '../services/userService';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const loadAppointments = async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }
        
        // Fetch all appointments with a high limit to avoid pagination
        const params = {
          limit: 1000 // Request all appointments
        };
        
        const response = await appointmentService.getAll(params);
        console.log('Appointments API response:', response);
        console.log('Response data:', response.data);
        console.log('Response data type:', typeof response.data, Array.isArray(response.data));
        console.log('response.data.data:', response.data?.data);
        console.log('response.data.appointments:', response.data?.appointments);
        
        // Handle different response structures
        let appointmentsData;
        if (Array.isArray(response.data)) {
          appointmentsData = response.data;
        } else if (response.data?.data?.appointments) {
          // Backend returns { success, data: { appointments: [], pagination: {} } }
          appointmentsData = response.data.data.appointments;
        } else if (response.data?.appointments) {
          appointmentsData = response.data.appointments;
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          appointmentsData = response.data.data;
        } else {
          appointmentsData = [];
        }
        
        console.log('Parsed appointments array:', appointmentsData);
        console.log('Appointments count:', appointmentsData?.length);
        setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
        setLastUpdated(new Date());
      } catch (err) {
        console.error('Error loading appointments:', err);
        setAppointments([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

    loadAppointments();

    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing appointments...');
      loadAppointments(true);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = async () => {
    try {
      setRefreshing(true);
      // Fetch all appointments with a high limit to avoid pagination
      const params = {
        limit: 1000 // Request all appointments
      };
      const response = await appointmentService.getAll(params);
      
      // Handle different response structures
      let appointmentsData;
      if (Array.isArray(response.data)) {
        appointmentsData = response.data;
      } else if (response.data?.data?.appointments) {
        appointmentsData = response.data.data.appointments;
      } else if (response.data?.appointments) {
        appointmentsData = response.data.appointments;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        appointmentsData = response.data.data;
      } else {
        appointmentsData = [];
      }
      
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error refreshing appointments:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return { bg: '#dbeafe', color: '#1e40af' };
      case 'CONFIRMED':
        return { bg: '#dbeafe', color: '#1e40af' };
      case 'COMPLETED':
        return { bg: '#d1fae5', color: '#065f46' };
      case 'CANCELLED':
        return { bg: '#fee2e2', color: '#991b1b' };
      default:
        return { bg: '#f3f4f6', color: '#374151' };
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = (
      apt.patient?.firstName?.toLowerCase().includes(searchLower) ||
      apt.patient?.lastName?.toLowerCase().includes(searchLower) ||
      apt.doctor?.firstName?.toLowerCase().includes(searchLower) ||
      apt.doctor?.lastName?.toLowerCase().includes(searchLower) ||
      apt.reason?.toLowerCase().includes(searchLower)
    );
    
    // Apply status filter
    const matchesStatus = statusFilter === 'ALL' || apt.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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
          <p style={{ color: '#666' }}>Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h1 style={{ marginBottom: '0.5rem', fontSize: '2rem', fontWeight: '700' }}>Appointments Management</h1>
            <p style={{ color: '#666' }}>Monitor and manage all appointments</p>
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

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ flex: 1 }}>
            <input
              type="text"
              placeholder="🔍 Search by patient, doctor, or reason..."
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiFilter style={{ color: '#6b7280' }} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '0.75rem 1rem',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '1rem',
                cursor: 'pointer',
                background: 'white'
              }}
            >
              <option value="ALL">All Status ({appointments.length})</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {filteredAppointments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</p>
          <p style={{ color: '#9ca3af', fontSize: '1.1rem' }}>No appointments found</p>
        </div>
      ) : (
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
              <tr>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Date & Time</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Patient</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Doctor</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Reason</th>
                <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((appointment) => {
                const statusStyle = getStatusColor(appointment.status);
                return (
                  <tr 
                    key={appointment.id}
                    onClick={() => handleAppointmentClick(appointment)}
                    style={{ 
                      borderTop: '1px solid #e5e7eb', 
                      transition: 'background 0.2s',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                  >
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FiCalendar style={{ color: '#6b7280' }} />
                        <div>
                          <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                            {appointment.dateTime ? new Date(appointment.dateTime).toLocaleDateString() : 
                             appointment.appointmentDate ? new Date(appointment.appointmentDate).toLocaleDateString() : 'N/A'}
                          </div>
                          <div style={{ fontSize: '0.875rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <FiClock size={12} />
                            {appointment.dateTime ? new Date(appointment.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) :
                             appointment.appointmentTime || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FiUser style={{ color: '#6b7280' }} />
                        <div>
                          <div style={{ fontWeight: '600' }}>
                            {appointment.patient?.firstName} {appointment.patient?.lastName}
                          </div>
                          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                            ID: {appointment.patientId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                        Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {appointment.doctor?.specialization}
                      </div>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#374151' }}>
                      {appointment.reason || 'General Consultation'}
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
                        {appointment.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
          Showing {filteredAppointments.length} of {appointments.length} appointments • Auto-refreshes every 30 seconds
        </p>
      </div>

      {showDetailModal && selectedAppointment && (
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
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>Appointment Details</h2>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedAppointment(null);
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
              <div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem' }}>STATUS</h3>
                <span style={{
                  padding: '0.5rem 1rem',
                  background: getStatusColor(selectedAppointment.status).bg,
                  color: getStatusColor(selectedAppointment.status).color,
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  display: 'inline-block'
                }}>
                  {selectedAppointment.status}
                </span>
              </div>

              <div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem' }}>DATE & TIME</h3>
                <p style={{ fontSize: '1rem', color: '#1f2937' }}>
                  📅 {new Date(selectedAppointment.dateTime || selectedAppointment.appointmentDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                <p style={{ fontSize: '1rem', color: '#1f2937', marginTop: '0.25rem' }}>
                  🕐 {selectedAppointment.dateTime 
                    ? new Date(selectedAppointment.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : selectedAppointment.appointmentTime || 'Not specified'}
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem' }}>PATIENT</h3>
                <p style={{ fontSize: '1rem', color: '#1f2937', fontWeight: '600' }}>
                  {selectedAppointment.patient?.firstName} {selectedAppointment.patient?.lastName}
                </p>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  Patient ID: {selectedAppointment.patientId}
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem' }}>DOCTOR</h3>
                <p style={{ fontSize: '1rem', color: '#1f2937', fontWeight: '600' }}>
                  Dr. {selectedAppointment.doctor?.firstName} {selectedAppointment.doctor?.lastName}
                </p>
                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  {selectedAppointment.doctor?.specialization}
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem' }}>REASON</h3>
                <p style={{ fontSize: '1rem', color: '#1f2937' }}>
                  {selectedAppointment.reason || 'General Consultation'}
                </p>
              </div>

              {selectedAppointment.notes && (
                <div>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem' }}>NOTES</h3>
                  <p style={{ fontSize: '1rem', color: '#1f2937' }}>
                    {selectedAppointment.notes}
                  </p>
                </div>
              )}

              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
                <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                  Created: {new Date(selectedAppointment.createdAt).toLocaleString()}
                </p>
              </div>
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
