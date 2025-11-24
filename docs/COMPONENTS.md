# Component Documentation

## Table of Contents

- [Layout Component](#layout-component)
- [Page Components](#page-components)
  - [Dashboard](#dashboard)
  - [Login](#login)
  - [Users](#users)
  - [Patients](#patients)
  - [Prescriptions](#prescriptions)
  - [Billing](#billing)
- [Styling Guide](#styling-guide)
- [Best Practices](#best-practices)

---

## Layout Component

**File:** `src/components/layout/Layout.jsx`

### Overview

The Layout component provides the main application structure with a sidebar navigation and header. It wraps all authenticated pages.

### Features

- Modern sidebar with gradient background
- Sticky header with page title
- User profile section (clickable, navigates to settings)
- Logout functionality
- Active route highlighting
- Responsive design

### Code Structure

```javascript
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

  const navigation = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/users', icon: '👥', label: 'Users' },
    // ...more navigation items
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside>{/* sidebar content */}</aside>
      
      {/* Main Content */}
      <div>
        <header>{/* header content */}</header>
        <main>
          <Outlet /> {/* Child routes render here */}
        </main>
      </div>
    </div>
  );
}
```

### Customization

#### Adding a New Navigation Item

```javascript
const navigation = [
  // ... existing items
  { path: '/new-page', icon: '🆕', label: 'New Page' },
];
```

#### Styling the Sidebar

Key gradient:
```css
background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%)
```

Active state gradient:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
```

---

## Page Components

### Dashboard

**File:** `src/pages/Dashboard.jsx`

#### Overview

The Dashboard provides an overview of the entire system with quick stats, action cards, and recent activity.

#### Structure

```javascript
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({...});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {/* Welcome Section */}
      <WelcomeSection stats={stats} />
      
      {/* Quick Actions */}
      <QuickActions navigate={navigate} />
      
      {/* Statistics */}
      <StatisticsOverview stats={stats} />
      
      {/* Recent Activity */}
      <RecentActivity activities={recentActivity} />
    </div>
  );
}
```

#### Key Sections

**1. Welcome Section**
```javascript
<div style={{
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '16px',
  padding: '2rem',
  color: 'white'
}}>
  <h1>Welcome Back, Admin! 👋</h1>
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
    {quickStats.map(stat => (
      <StatCard key={stat.label} {...stat} />
    ))}
  </div>
</div>
```

**2. Quick Action Cards**
```javascript
{quickActions.map((action) => (
  <div
    key={action.path}
    onClick={() => navigate(action.path)}
    style={{
      background: 'white',
      borderRadius: '12px',
      padding: '1.25rem',
      cursor: 'pointer',
      transition: 'all 0.2s'
    }}
  >
    <div style={{ background: action.gradient }}>
      {action.icon}
    </div>
    <h3>{action.label}</h3>
    <p>{action.desc}</p>
  </div>
))}
```

---

### Login

**File:** `src/pages/Login.jsx`

#### Overview

Modern login page with gradient design and feature showcase.

#### Features

- Active Directory authentication
- Responsive two-panel layout
- Feature cards with hover effects
- Professional branding

#### Code Example

```javascript
export default function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authService.login(credentials.email, credentials.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      {/* Left: Feature Panel */}
      <div style={{ background: 'linear-gradient(...)' }}>
        {features.map(feature => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>

      {/* Right: Login Form */}
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={credentials.email}
            onChange={(e) => setCredentials({...credentials, email: e.target.value})}
          />
          <input
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
```

---

### Users

**File:** `src/pages/Users.jsx`

#### Features

- User listing with search
- Role-based filtering
- Delete functionality (patients only)
- Pagination

#### Hook Structure

```javascript
const [users, setUsers] = useState([]);
const [searchTerm, setSearchTerm] = useState('');
const [roleFilter, setRoleFilter] = useState('ALL');
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage] = useState(15);
```

#### Delete User Function

```javascript
const handleDelete = async (user) => {
  if (!confirm(`Delete ${user.firstName} ${user.lastName}?`)) return;

  try {
    // Find patient record by userId
    const patientResponse = await patientService.getAll();
    const patients = patientResponse.data?.data?.patients || [];
    const patientRecord = patients.find(p => p.userId === user.id);

    if (patientRecord) {
      await patientService.delete(patientRecord.id);
      setUsers(users.filter(u => u.id !== user.id));
    }
  } catch (err) {
    console.error('Delete error:', err);
    alert('Failed to delete user');
  }
};
```

---

### Patients

**File:** `src/pages/Patients.jsx`

#### Features

- Patient listing
- Two-step patient creation (user + patient profile)
- Search and filters
- Medical history management

#### Add Patient Modal

```javascript
const [showAddModal, setShowAddModal] = useState(false);
const [formData, setFormData] = useState({
  username: '',
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: 'MALE',
  bloodGroup: '',
  phone: '',
  address: '',
  emergencyContact: ''
});

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // Step 1: Register user
    const userResponse = await api.post('/auth/register', {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      role: 'PATIENT'
    });

    const userId = userResponse.data.user.id;

    // Step 2: Create patient profile
    await patientService.create({
      userId,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      bloodGroup: formData.bloodGroup,
      phone: formData.phone,
      address: formData.address,
      emergencyContact: formData.emergencyContact
    });

    // Reload data
    loadPatients();
    setShowAddModal(false);
  } catch (err) {
    console.error('Error creating patient:', err);
  }
};
```

---

### Prescriptions

**File:** `src/pages/Prescriptions.jsx`

#### Features

- Prescription listing with doctor names
- Stats cards (total, active, completed, cancelled)
- Detail modal
- Status filtering
- Pagination

#### Stats Calculation

```javascript
const stats = {
  total: prescriptions.length,
  active: prescriptions.filter(p => p.status === 'ACTIVE').length,
  completed: prescriptions.filter(p => p.status === 'COMPLETED').length,
  cancelled: prescriptions.filter(p => p.status === 'CANCELLED').length
};
```

#### Detail Modal

```javascript
const [selectedPrescription, setSelectedPrescription] = useState(null);
const [showDetailModal, setShowDetailModal] = useState(false);

const handleViewDetails = (prescription) => {
  setSelectedPrescription(prescription);
  setShowDetailModal(true);
};

// Modal JSX
{showDetailModal && (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)' }}>
    <div onClick={(e) => e.stopPropagation()}>
      <h2>Prescription Details</h2>
      <div>{selectedPrescription.medicationName}</div>
      <div>{selectedPrescription.dosage}</div>
      {/* ...more fields */}
      <button onClick={() => setShowDetailModal(false)}>Close</button>
    </div>
  </div>
)}
```

---

### Billing

**File:** `src/pages/Billing.jsx`

#### Features

- Invoice listing from all patients
- Dynamic stats calculation
- Month filter
- Status filter
- Pagination

#### Data Loading

```javascript
const loadInvoices = async () => {
  try {
    const response = await patientService.getAll({ limit: 1000 });
    const patients = response.data?.data?.patients || [];
    
    const allInvoices = [];
    patients.forEach(patient => {
      if (patient.invoices?.length) {
        patient.invoices.forEach(invoice => {
          allInvoices.push({
            ...invoice,
            patientId: patient.id,
            patientName: `${patient.firstName} ${patient.lastName}`
          });
        });
      }
    });
    
    setInvoices(allInvoices);
  } catch (err) {
    console.error('Error loading invoices:', err);
  }
};
```

#### Stats Calculation

```javascript
const calculateStats = (invoices) => {
  return {
    totalRevenue: invoices
      .filter(i => i.status === 'PAID')
      .reduce((sum, i) => sum + parseFloat(i.amount || 0), 0),
    
    pendingAmount: invoices
      .filter(i => i.status === 'PENDING')
      .reduce((sum, i) => sum + parseFloat(i.amount || 0), 0),
    
    thisMonth: invoices
      .filter(i => new Date(i.createdAt).getMonth() === new Date().getMonth())
      .reduce((sum, i) => sum + parseFloat(i.amount || 0), 0),
    
    totalInvoices: invoices.length
  };
};
```

---

## Styling Guide

### Color Palette

```javascript
const colors = {
  // Primary gradients
  primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  success: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  warning: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  info: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  
  // Neutrals
  gray: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a'
  }
};
```

### Common Patterns

#### Card with Hover Effect

```javascript
const cardStyle = {
  background: 'white',
  borderRadius: '12px',
  padding: '1.5rem',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  transition: 'all 0.3s',
  cursor: 'pointer'
};

<div
  style={cardStyle}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = 'translateY(-4px)';
    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
  }}
>
  Card Content
</div>
```

#### Glassmorphism Effect

```javascript
const glassStyle = {
  background: 'rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: '12px',
  padding: '1rem'
};
```

#### Gradient Button

```javascript
const gradientButton = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  padding: '0.75rem 1.5rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.2s',
  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.25)'
};
```

---

## Best Practices

### 1. State Management

Use `useState` for component-level state:
```javascript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
```

### 2. Data Fetching

Use `useEffect` with cleanup:
```javascript
useEffect(() => {
  let isMounted = true;
  
  const fetchData = async () => {
    try {
      const response = await api.get('/endpoint');
      if (isMounted) setData(response.data);
    } catch (err) {
      if (isMounted) setError(err.message);
    }
  };
  
  fetchData();
  return () => { isMounted = false; };
}, []);
```

### 3. Error Handling

Always wrap API calls in try-catch:
```javascript
try {
  const response = await api.get('/data');
  setData(response.data);
} catch (err) {
  console.error('Error:', err);
  setError(err.response?.data?.message || 'An error occurred');
}
```

### 4. Loading States

Show loading spinners during async operations:
```javascript
if (loading) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
      <div className="spinner" />
      <p>Loading...</p>
    </div>
  );
}
```

### 5. Empty States

Handle empty data gracefully:
```javascript
{data.length === 0 ? (
  <div style={{ textAlign: 'center', padding: '3rem' }}>
    <p>No data found</p>
  </div>
) : (
  data.map(item => <ItemCard key={item.id} {...item} />)
)}
```

### 6. Responsive Design

Use CSS Grid for responsive layouts:
```javascript
style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '1.5rem'
}}
```

### 7. Accessibility

Add ARIA labels and keyboard support:
```javascript
<button
  aria-label="Close modal"
  onClick={handleClose}
  onKeyDown={(e) => e.key === 'Escape' && handleClose()}
>
  ×
</button>
```

---

## Performance Tips

1. **Memoization**: Use `useMemo` for expensive calculations
2. **Debouncing**: Debounce search inputs
3. **Pagination**: Limit data fetched per request
4. **Lazy Loading**: Code-split routes with `React.lazy`
5. **Auto-refresh**: Use reasonable intervals (30s+)

---

## Testing

### Example Unit Test

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from './Dashboard';

test('renders dashboard with welcome message', () => {
  render(<Dashboard />);
  const heading = screen.getByText(/Welcome Back, Admin!/i);
  expect(heading).toBeInTheDocument();
});
```

---

**For more examples, see the source code in `/src/pages/`**
