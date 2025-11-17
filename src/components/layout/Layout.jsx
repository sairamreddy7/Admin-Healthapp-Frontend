import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f3f4f6' }}>
      <aside style={{
        width: '250px',
        background: 'linear-gradient(180deg, #1f2937 0%, #111827 100%)',
        color: 'white',
        padding: '1.5rem',
        boxShadow: '2px 0 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          marginBottom: '2rem', 
          paddingBottom: '1.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Admin Portal</h2>
          <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Healthcare Management System</p>
        </div>
        <nav>
          <NavLink to="/dashboard" isActive={isActive('/dashboard')}>📊 Dashboard</NavLink>
          <NavLink to="/users" isActive={isActive('/users')}>👥 Users</NavLink>
          <NavLink to="/doctors" isActive={isActive('/doctors')}>🩺 Doctors</NavLink>
          <NavLink to="/patients" isActive={isActive('/patients')}>🏥 Patients</NavLink>
          <NavLink to="/appointments" isActive={isActive('/appointments')}>📅 Appointments</NavLink>
          <NavLink to="/billing" isActive={isActive('/billing')}>💰 Billing</NavLink>
          <NavLink to="/prescriptions" isActive={isActive('/prescriptions')}>💊 Prescriptions</NavLink>
          <NavLink to="/test-results" isActive={isActive('/test-results')}>🧪 Test Results</NavLink>
          <NavLink to="/messages" isActive={isActive('/messages')}>💬 Messages</NavLink>
          <NavLink to="/audit-logs" isActive={isActive('/audit-logs')}>📋 Audit Logs</NavLink>
          <NavLink to="/settings" isActive={isActive('/settings')}>⚙️ Settings</NavLink>
        </nav>
        <div style={{ 
          position: 'absolute',
          bottom: '1.5rem',
          left: '1.5rem',
          right: '1.5rem',
          paddingTop: '1rem',
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ 
            fontSize: '0.75rem', 
            color: '#9ca3af',
            marginBottom: '0.5rem'
          }}>
            Version 1.0.0
          </div>
        </div>
      </aside>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{
          background: 'white',
          padding: '1rem 2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Healthcare Admin</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              padding: '0.5rem 1rem',
              background: '#f3f4f6',
              borderRadius: '8px',
              fontSize: '0.875rem'
            }}>
              <span style={{ color: '#666' }}>👤 {user?.email}</span>
            </div>
            <button onClick={handleLogout} style={{
              padding: '0.5rem 1rem',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = '#dc2626'}
            onMouseLeave={(e) => e.target.style.background = '#ef4444'}
            >
              🚪 Logout
            </button>
          </div>
        </header>
        <main style={{ padding: '2rem', flex: 1 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function NavLink({ to, children, isActive }) {
  return (
    <Link to={to} style={{
      display: 'block',
      padding: '0.75rem 1rem',
      marginBottom: '0.5rem',
      color: 'white',
      textDecoration: 'none',
      borderRadius: '8px',
      transition: 'all 0.2s',
      background: isActive ? '#667eea' : 'transparent',
      fontWeight: isActive ? '600' : '400'
    }}
    onMouseEnter={(e) => {
      if (!isActive) e.target.style.background = '#374151';
    }}
    onMouseLeave={(e) => {
      if (!isActive) e.target.style.background = 'transparent';
    }}
    >
      {children}
    </Link>
  );
}
