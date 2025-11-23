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
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const apiMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Invalid username or password. Please try again.';
      setError(apiMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      {/* LEFT PANEL - Features */}
      <section
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '3rem',
          color: 'white',
        }}
      >
        <div style={{ maxWidth: '500px', width: '100%' }}>
          {/* Logo & Brand */}
          <div style={{ marginBottom: '3rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '2rem',
              }}
            >
              <div
                style={{
                  width: '3.5rem',
                  height: '3.5rem',
                  borderRadius: '16px',
                  background: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                }}
              >
                🏥
              </div>
              <span
                style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: 'white',
                }}
              >
                HealthApp
              </span>
            </div>
            <h1
              style={{
                fontSize: '3rem',
                lineHeight: '1.1',
                fontWeight: '800',
                marginBottom: '1.25rem',
              }}
            >
              Admin Portal
            </h1>
            <p
              style={{
                fontSize: '1.25rem',
                opacity: 0.95,
                lineHeight: '1.6',
              }}
            >
              Centralized platform to manage healthcare operations, monitor users, and oversee system performance.
            </p>
          </div>

          {/* Feature Cards */}
          <div style={{ display: 'grid', gap: '1.25rem' }}>
            {[
              {
                icon: '🏥',
                title: 'Healthcare Management',
                description: 'Comprehensive control over doctors, patients, and appointments',
              },
              {
                icon: '📊',
                title: 'Real-time Analytics',
                description: 'Monitor system performance and user activities in real-time',
              },
              {
                icon: '🔒',
                title: 'Enterprise Security',
                description: 'Active Directory integration with role-based access control',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'start',
                  gap: '1rem',
                  padding: '1.5rem',
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.3s',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(8px)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                }}
              >
                <div
                  style={{
                    minWidth: '3rem',
                    height: '3rem',
                    borderRadius: '12px',
                    background: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                  }}
                >
                  {feature.icon}
                </div>
                <div>
                  <h3
                    style={{
                      fontWeight: '600',
                      marginBottom: '0.25rem',
                      fontSize: '1.125rem',
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.9375rem',
                      opacity: 0.9,
                      lineHeight: '1.5',
                    }}
                  >
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RIGHT PANEL - Login Form */}
      <section
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          background: '#f8f9fa',
        }}
      >
        <div
          style={{
            background: 'white',
            borderRadius: '24px',
            padding: '3rem',
            width: '100%',
            maxWidth: '460px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
          }}
        >
          {/* Form Header */}
          <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
            <h2
              style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: '#1f2937',
                marginBottom: '0.5rem',
              }}
            >
              Welcome Back
            </h2>
            <p style={{ color: '#6b7280', fontSize: '1rem' }}>
              Sign in to access your admin dashboard
            </p>
          </div>

          {/* Login Form */}
          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
            }}
          >
            {/* Error Message */}
            {error && (
              <div
                style={{
                  padding: '1rem 1.25rem',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '12px',
                  color: '#991b1b',
                  fontSize: '0.9375rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <span style={{ fontSize: '1.25rem' }}>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Username Field */}
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '0.9375rem',
                }}
              >
                Username
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="AdminMary@healthcare-portal.local"
                  required
                  autoComplete="username"
                  style={{
                    width: '100%',
                    padding: '1rem 1.25rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    transition: 'all 0.2s',
                    outline: 'none',
                    background: '#f9fafb',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.background = 'white';
                    e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.background = '#f9fafb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '0.9375rem',
                }}
              >
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  style={{
                    width: '100%',
                    padding: '1rem 1.25rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    transition: 'all 0.2s',
                    outline: 'none',
                    background: '#f9fafb',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.background = 'white';
                    e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.background = '#f9fafb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '1rem',
                background: loading
                  ? '#9ca3af'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                boxShadow: loading
                  ? 'none'
                  : '0 8px 20px rgba(102, 126, 234, 0.3)',
                marginTop: '0.5rem',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 12px 28px rgba(102, 126, 234, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.3)';
              }}
            >
              {loading ? (
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                  }}
                >
                  <span
                    style={{
                      width: '1.25rem',
                      height: '1.25rem',
                      border: '3px solid rgba(255, 255, 255, 0.3)',
                      borderTop: '3px solid white',
                      borderRadius: '50%',
                      animation: 'spin 0.6s linear infinite',
                    }}
                  />
                  Signing in...
                </span>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>

            {/* Footer */}
            <div
              style={{
                marginTop: '1.5rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid #e5e7eb',
                textAlign: 'center',
              }}
            >
              <p
                style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  lineHeight: '1.6',
                }}
              >
                🔒 Secured with enterprise-grade authentication
                <br />
                <span style={{ fontSize: '0.8125rem', color: '#9ca3af' }}>
                  © {new Date().getFullYear()} HealthApp Portal. All rights reserved.
                </span>
              </p>
            </div>
          </form>
        </div>
      </section>

      {/* Animations */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 1024px) {
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