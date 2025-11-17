import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      {/* LEFT PANEL */}
      <section style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: '2.5rem',
        borderRight: '1px solid #e5e7eb'
      }}>
        <div style={{ width: '100%', maxWidth: '36rem', paddingLeft: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
            <div style={{ 
              width: '2rem', 
              height: '2rem', 
              borderRadius: '0.375rem', 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }} />
            <span style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1f2937' }}>
              HealthApp Admin
            </span>
          </div>
          <h1 style={{ 
            fontSize: '2.5rem', 
            lineHeight: '1.2', 
            fontWeight: '800', 
            color: '#111827',
            marginBottom: '1rem'
          }}>
            Welcome to Admin Portal
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1.125rem', lineHeight: '1.75' }}>
            Secure access to manage your healthcare platform. Monitor users, doctors, patients, and system operations.
          </p>
          
          <div style={{ 
            marginTop: '3rem', 
            padding: '1.5rem', 
            background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
            borderRadius: '1rem',
            border: '1px solid #d1d5db'
          }}>
            <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
              <div style={{
                minWidth: '3rem',
                height: '3rem',
                borderRadius: '0.75rem',
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem'
              }}>
                🔐
              </div>
              <div>
                <h3 style={{ fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                  Enhanced Security
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.5' }}>
                  Email-based authentication with encrypted credentials. Two-factor authentication and session management available in settings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RIGHT PANEL */}
      <section style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: '2.5rem',
        padding: '1.5rem',
        background: '#fafafa'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '2.5rem',
          width: '100%',
          maxWidth: '28rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: '1px solid #e5e7eb'
        }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: '800', color: '#111827', marginBottom: '0.5rem' }}>
            Admin Sign In
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
            Access your admin dashboard securely
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {error && (
              <div style={{ 
                padding: '1rem', 
                background: '#fee2e2',
                border: '1px solid #fecaca',
                borderRadius: '0.5rem',
                color: '#991b1b',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span style={{ fontSize: '1.25rem' }}>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '500',
                color: '#374151',
                fontSize: '0.875rem'
              }}>
                Username
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                  fontSize: '1.25rem'
                }}>
                  👤
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin"
                  required
                  autoComplete="username"
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem 0.875rem 3rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    transition: 'all 0.2s',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ 
                  fontWeight: '500',
                  color: '#374151',
                  fontSize: '0.875rem'
                }}>
                  Password
                </label>
                <a 
                  href="/forgot-password" 
                  style={{ 
                    fontSize: '0.875rem', 
                    color: '#667eea',
                    textDecoration: 'none',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                >
                  Forgot Password?
                </a>
              </div>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                  fontSize: '1.25rem'
                }}>
                  🔒
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your secure password"
                  required
                  autoComplete="current-password"
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem 0.875rem 3rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    transition: 'all 0.2s',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Security Indicator */}
            <div style={{ 
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '0.5rem',
              padding: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <div style={{
                width: '2rem',
                height: '2rem',
                borderRadius: '0.5rem',
                background: '#dcfce7',
                border: '2px solid #22c55e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem'
              }}>
                🛡️
              </div>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#166534', fontWeight: '500' }}>
                  Secure Connection Active
                </p>
                <p style={{ fontSize: '0.75rem', color: '#15803d', marginTop: '0.125rem' }}>
                  Your data is encrypted with AES-256
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '1rem',
                background: loading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                boxShadow: loading ? 'none' : '0 4px 6px -1px rgba(102, 126, 234, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 10px 15px -3px rgba(102, 126, 234, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 6px -1px rgba(102, 126, 234, 0.3)';
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <span style={{ 
                    width: '1rem', 
                    height: '1rem', 
                    border: '2px solid white',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 0.6s linear infinite'
                  }}></span>
                  Signing in...
                </span>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>

            <div style={{ 
              marginTop: '1rem',
              paddingTop: '1rem',
              borderTop: '1px solid #e5e7eb',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '0.75rem', color: '#9ca3af', lineHeight: '1.5' }}>
                Protected by enterprise-grade security. Need help?{' '}
                <a 
                  href="/support" 
                  style={{ color: '#667eea', textDecoration: 'none', fontWeight: '500' }}
                  onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                >
                  Contact Support
                </a>
              </p>
            </div>

            <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#9ca3af' }}>
              © {new Date().getFullYear()} HealthApp Admin Portal ·{' '}
              <a 
                href="/privacy" 
                style={{ color: '#9ca3af', textDecoration: 'none' }}
                onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
              >
                Privacy Policy
              </a>
              {' · '}
              <a 
                href="/terms" 
                style={{ color: '#9ca3af', textDecoration: 'none' }}
                onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
              >
                Terms
              </a>
            </div>
          </form>
        </div>
      </section>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
          section:first-child {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
