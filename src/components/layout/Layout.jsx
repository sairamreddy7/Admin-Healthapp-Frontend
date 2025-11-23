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

  const navigation = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/users', icon: '👥', label: 'Users' },
    { path: '/doctors', icon: '🩺', label: 'Doctors' },
    { path: '/patients', icon: '🏥', label: 'Patients' },
    { path: '/appointments', icon: '📅', label: 'Appointments' },
    { path: '/billing', icon: '💰', label: 'Billing' },
    { path: '/prescriptions', icon: '💊', label: 'Prescriptions' },
    { path: '/test-results', icon: '🧪', label: 'Test Results' },
    { path: '/audit-logs', icon: '📋', label: 'Audit Logs' },
    { path: '/settings', icon: '⚙️', label: 'Settings' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Sidebar */}
      <aside style={{
        width: '280px',
        background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '4px 0 24px rgba(0, 0, 0, 0.12)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative gradient overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(102, 126, 234, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          transform: 'translate(50%, -50%)',
          pointerEvents: 'none'
        }} />

        {/* Logo Section */}
        <div style={{
          padding: '2rem 1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '0.5rem'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              boxShadow: '0 8px 16px rgba(102, 126, 234, 0.3)'
            }}>
              🏥
            </div>
            <div>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                margin: 0,
                background: 'linear-gradient(135deg, #fff 0%, #e2e8f0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                HealthApp
              </h2>
              <p style={{
                fontSize: '0.75rem',
                color: '#94a3b8',
                margin: 0
              }}>
                Admin Portal
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{
          flex: 1,
          padding: '1.5rem 1rem',
          overflowY: 'auto',
          position: 'relative',
          zIndex: 1
        }}>
          {navigation.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.875rem 1rem',
                  marginBottom: '0.5rem',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  color: active ? '#fff' : '#cbd5e1',
                  background: active
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'transparent',
                  fontWeight: active ? '600' : '500',
                  fontSize: '0.9375rem',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: active ? '0 4px 12px rgba(102, 126, 234, 0.25)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                    e.currentTarget.style.color = '#fff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.color = '#cbd5e1';
                  }
                }}
              >
                <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                <span>{item.label}</span>
                {active && (
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '4px',
                    height: '60%',
                    background: '#fff',
                    borderRadius: '0 4px 4px 0'
                  }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{
          padding: '1.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: '#64748b'
          }}>
            <span>Version 1.0.0</span>
            <span>© 2025</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header style={{
          background: 'white',
          padding: '1.25rem 2rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #f1f5f9',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          {/* Page Title */}
          <div>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#0f172a',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              {navigation.find(item => item.path === location.pathname)?.icon || '📊'}
              <span>{navigation.find(item => item.path === location.pathname)?.label || 'Dashboard'}</span>
            </h1>
          </div>

          {/* User Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* User Profile */}
            <div
              onClick={() => navigate('/settings')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.625rem 1.25rem',
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: '1px solid #e2e8f0'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                color: 'white'
              }}>
                👤
              </div>
              <div>
                <div style={{
                  fontSize: '0.8125rem',
                  fontWeight: '600',
                  color: '#334155',
                  lineHeight: 1.2
                }}>
                  {user?.email?.split('@')[0] || 'Admin'}
                </div>
                <div style={{
                  fontSize: '0.6875rem',
                  color: '#64748b'
                }}>
                  Administrator
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.625rem 1.25rem',
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600',
                transition: 'all 0.2s',
                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.25)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.25)';
              }}
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main style={{
          padding: '2rem',
          flex: 1,
          background: '#f8fafc',
          overflowY: 'auto'
        }}>
          <Outlet />
        </main>
      </div>

      {/* Global Styles */}
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
            sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* Scrollbar Styling */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f5f9;
        }

        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}

function NavLink({ to, children, isActive }) {
  return null; // Not used anymore, keeping for compatibility
}
