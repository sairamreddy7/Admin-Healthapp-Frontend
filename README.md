# 🏥 HealthApp - Admin Portal

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> A modern, secure, and feature-rich administrative portal for managing the HealthApp healthcare ecosystem.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Components](#components)
- [API Integration](#api-integration)
- [Deployment](#deployment)
- [Security](#security)
- [Contributing](#contributing)

---

## 🎯 Overview

The **HealthApp Admin Portal** is a comprehensive web application designed to provide healthcare administrators with centralized control over the entire healthcare management system. It enables efficient management of users, doctors, patients, appointments, billing, prescriptions, and system monitoring.

### Key Highlights

- ✨ Modern, responsive UI with gradient designs and smooth animations
- 🔐 Secure Active Directory authentication
- 📊 Real-time dashboard with analytics
- 🚀 Quick action cards for common tasks
- 📱 Mobile-responsive design
- 🔄 Auto-refresh data every 30 seconds
- 🎨 Professional glassmorphism and modern UI patterns

---

## 🌟 Features

### User Management
- View and manage all system users (patients, doctors, admins)
- Add new patients with comprehensive registration
- Delete patient records
- Role-based access control
- Active Directory integration

### Doctor Management
- View all registered doctors
- Browse by specialization
- Access doctor profiles and contact information
- Read-only interface for data integrity

### Patient Management  
- Comprehensive patient registration
- Two-step account creation (user + patient profile)
- Patient demographics and medical information
- Gender and username fields

### Appointment System
- View all appointments across the system
- Filter by status (scheduled, completed, cancelled)
- Real-time appointment updates
- Patient-doctor assignment tracking

### Billing & Invoices
- View all system invoices
- Track payment status (paid, pending, cancelled)
- Revenue analytics and statistics
- Monthly billing summaries
- Export capabilities

### Prescriptions Management
- View all prescribed medications
- Doctor and medication information
- Prescription status tracking (active, completed, cancelled)
- Dosage and frequency details
- Statistics cards for quick insights

### Test Results
- Lab and diagnostic test results
- Patient test history
- Status tracking (completed, pending, reviewed)
- Enhanced date field detection

### Audit Logs
- Comprehensive system activity tracking
- User action logging
- Pagination and sorting
- Advanced filtering options

### Settings
- Admin profile management
- Security settings
- Admin user management with permissions
- System configuration

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────┐
│   VM1 (Azure)   │
│   PostgreSQL    │
│    Database     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐         ┌─────────────────┐
│   VM4 (Azure)   │◄────────│   VM2 (Azure)   │
│  Backend API    │         │  Admin Portal   │
│  (Docker/Node)  │         │  (React/Nginx)  │
└─────────────────┘         └─────────────────┘
```

### Infrastructure

- **VM1**: PostgreSQL database server
- **VM2**: Admin Portal frontend (this repository)
- **VM4**: Backend API server (Node.js/Express in Docker)

### Authentication Flow

```
User Login
    ↓
Active Directory Authentication (/auth/staff-ad-login)
    ↓
JWT Token Generation
    ↓
Axios Interceptor (adds token to all requests)
    ↓
Protected Route Access
```

---

## 💻 Tech Stack

### Frontend Core
- **React 18.3.1** - UI library
- **Vite 7.2.4** - Build tool and dev server
- **React Router DOM 7.1.1** - Client-side routing

### Styling & UI
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **React Icons** - Icon library
- **Custom CSS** - Gradients, animations, glassmorphism

### HTTP & State Management
- **Axios 1.7.9** - HTTP client with interceptors
- **React Hooks** - State management (useState, useEffect)

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

---

## 🚀 Getting Started

### Prerequisites

```bash
Node.js: >= 18.x
npm: >= 9.x
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/sairamreddy7/Admin-Healthapp-Frontend.git
cd Admin-Healthapp-Frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=https://healthapp-beta.eastus.cloudapp.azure.com/api
```

4. **Configure for local development**

In `vite.config.js`, **comment out** the base path:
```javascript
export default defineConfig({
  plugins: [react()],
  // base: '/admin/',  // ← Comment this for local dev
  server: {
    port: 5174,
  },
});
```

In `src/App.jsx`, **comment out** the basename:
```javascript
<BrowserRouter /* basename="/admin" */>
  {/* routes */}
</BrowserRouter>
```

5. **Start development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5174`

### Default Admin Credentials

```
Username: HealthAppSuperAdmin@healthcare-portal.local
Password: H3althApp@2025!
```

### Additional Admin Accounts

```
AdminMary@healthcare-portal.local
AdminSnehith@healthcare-portal.local
AdminSairam@healthcare-portal.local
AdminFarheen@healthcare-portal.local
AdminAbhishek@healthcare-portal.local

All use password: H3althApp@2025!
```

---

## 📁 Project Structure

```
Admin-Healthapp-Frontend/
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable React components
│   │   └── layout/
│   │       └── Layout.jsx          # Main layout with sidebar & header
│   ├── pages/            # Page components
│   │   ├── Login.jsx               # Modern login page
│   │   ├── Dashboard.jsx           # Admin dashboard with quick actions
│   │   ├── Users.jsx               # User management
│   │   ├── Doctors.jsx             # Doctor listing (read-only)
│   │   ├── Patients.jsx            # Patient management
│   │   ├── Appointments.jsx        # Appointment management
│   │   ├── Billing.jsx             # Billing & invoices
│   │   ├── Prescriptions.jsx       # Prescription management
│   │   ├── TestResults.jsx         # Lab results
│   │   ├── AuditLogs.jsx          # System audit logs
│   │   └── Settings.jsx            # Admin settings
│   ├── services/         # API service layer
│   │   ├── api.js                  # Axios instance with interceptors
│   │   ├── authService.js          # Authentication services
│   │   └── userService.js          # User/patient/doctor services
│   ├── App.jsx           # Root component with routes
│   ├── main.jsx          # Application entry point
│   └── index.css         # Global styles
├── .env                  # Environment variables
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── package.json          # Project dependencies
└── README.md             # This file
```

---

## 🧩 Components

### Layout Component (`src/components/layout/Layout.jsx`)

The main application layout featuring:
- **Modern Sidebar**: Gradient background with decorative elements
- **Sticky Header**: Page title, user profile, logout button
- **Navigation**: Icon-based menu with active state indicators
- **User Profile**: Clickable card that navigates to settings
- **Responsive Design**: Adapts to different screen sizes

**Key Features:**
```javascript
- Gradient effects and glassmorphism
- Smooth hover animations
- Active route highlighting
- Sticky header that stays visible while scrolling
```

### Page Components

#### Dashboard (`src/pages/Dashboard.jsx`)
- **Hero Welcome Section**: Gradient card with quick stats
- **Quick Actions**: 6 action cards for common tasks
- **Statistics Overview**: Detailed metrics
- **Recent Activity**: Real-time system events

#### Users Page (`src/pages/Users.jsx`)
- User listing with role-based filtering
- Search and pagination
- Delete functionality (patients only)
- Add new patient button

#### Prescriptions Page (`src/pages/Prescriptions.jsx`)
- Medication listing with doctor names
- Stats cards (total, active, completed, cancelled)
- Status filtering
- Detail modal with comprehensive information
- Hover effects and animations

#### Billing Page (`src/pages/Billing.jsx`)
- Invoice listing from all patients
- Dynamic stats calculation (total revenue, pending, monthly)
- Status filters (paid, pending, cancelled)
- Month selection
- Pagination

---

## 🔌 API Integration

### Service Architecture

All API calls are centralized in the `src/services/` directory:

#### `api.js` - Axios Instance
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - adds auth token
api.interceptors.request.use(config => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handles 401 errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      authService.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

#### `authService.js` - Authentication
```javascript
export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/staff-ad-login', {
      email,
      password,
    });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};
```

#### `userService.js` - Data Services

```javascript
export const userService = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  delete: (id) => api.delete(`/users/${id}`),
};

export const doctorService = {
  getAll: () => api.get('/doctors'),
  getById: (id) => api.get(`/doctors/${id}`),
};

export const patientService = {
  getAll: () => api.get('/patients'),
  getById: (id) => api.get(`/patients/${id}`),
  create: (data) => api.post('/patients', data),
  delete: (id) => api.delete(`/patients/${id}`),
};

export const prescriptionService = {
  getAll: (params) => api.get('/medications', { params }),
};

export const billingService = {
  getAll: async () => {
    // Fetches all invoices from patients endpoint
    const response = await api.get('/patients', { params: { limit: 1000 } });
    const patients = response.data?.data?.patients || [];
    
    const allInvoices = [];
    patients.forEach(patient => {
      if (patient.invoices?.length) {
        patient.invoices.forEach(invoice => {
          allInvoices.push({
            ...invoice,
            patientId: patient.id,
            patientName: `${patient.firstName} ${patient.lastName}`,
          });
        });
      }
    });
    
    return { data: { data: allInvoices } };
  },
};
```

### API Endpoints Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/staff-ad-login` | POST | Admin login with Active Directory |
| `/users` | GET | Get all users |
| `/users/:id` | GET | Get user by ID |
| `/users/:id` | DELETE | Delete user |
| `/doctors` | GET | Get all doctors |
| `/patients` | GET | Get all patients |
| `/patients` | POST | Create new patient |
| `/patients/:id` | DELETE | Delete patient |
| `/medications` | GET | Get all prescriptions |
| `/test-results` | GET | Get all test results |
| `/appointments` | GET | Get all appointments |
| `/audit-logs` | GET | Get audit logs |

---

## 🚀 Deployment

### Production Build

**IMPORTANT**: Before building for production, you must uncomment the base paths:

1. **In `vite.config.js`**:
```javascript
export default defineConfig({
  plugins: [react()],
  base: '/admin/',  // ← Uncomment this line
  server: {
    port: 5174,
  },
});
```

2. **In `src/App.jsx`**:
```javascript
<BrowserRouter basename="/admin">  {/* ← Uncomment basename */}
  {/* routes */}
</BrowserRouter>
```

3. **Build the application**:
```bash
npm run build
```

The production files will be in the `dist/` directory.

### Deployment to VM2

#### Method 1: Automated Script

```bash
./deploy.sh
```

#### Method 2: Manual Deployment

1. **SSH into VM2**:
```bash
ssh grp06admin@20.42.48.79
# or
ssh azureuser@grp06healthapp.eastus.cloudapp.azure.com
```

2. **Navigate to project**:
```bash
cd /var/www/html/admin
```

3. **Pull latest code**:
```bash
git pull origin main
npm install
```

4. **Configure for production**:
```bash
# Uncomment base path
sed -i "s|// base: '/admin/',|base: '/admin/',|g" vite.config.js

# Uncomment basename
nano src/App.jsx  # Edit manually to uncomment basename="/admin"
```

5. **Build**:
```bash
npm run build
```

6. **Deploy to web server**:
```bash
sudo cp -r dist/* /var/www/admin-portal/
sudo chown -R www-data:www-data /var/www/admin-portal/
sudo chmod -R 755 /var/www/admin-portal/
sudo systemctl restart nginx
```

### Nginx Configuration

```nginx
location /admin {
    alias /var/www/admin-portal;
    index index.html;
    try_files $uri $uri/ /admin/index.html;
}

location /admin/assets/ {
    alias /var/www/admin-portal/assets/;
}
```

### Environment Variables (Production)

```env
VITE_API_URL=https://healthapp-beta.eastus.cloudapp.azure.com/api
```

### Verification

After deployment, verify at: **https://grp06healthapp.eastus.cloudapp.azure.com/admin/**

---

## 🔐 Security

### Authentication
- **Active Directory Integration**: Secure enterprise-level authentication
- **JWT Tokens**: Stateless authentication with Bearer tokens
- **Auto-logout**: Automatic logout on token expiration (401 errors)
- **Protected Routes**: All routes require authentication

### Authorization
- **Role-Based Access**: Admin-only portal
- **Permission Checks**: Frontend validates user role
- **Backend Validation**: All requests validated by backend

### Best Practices
- **HTTPS Only**: All communication over SSL/TLS
- **Token Storage**: Tokens stored in localStorage (consider httpOnly cookies for enhanced security)
- **CORS Configuration**: Proper CORS headers on backend
- **Input Validation**: All user inputs validated
- **SQL Injection Prevention**: Backend uses parameterized queries

---

## 📊 Key Features Implementation

### Modern UI Elements

#### Glassmorphism
```css
.glass-card {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}
```

#### Gradient Backgrounds
```css
.gradient-purple {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

#### Hover Animations
```javascript
onMouseEnter={(e) => {
  e.currentTarget.style.transform = 'translateY(-4px)';
  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
}}
onMouseLeave={(e) => {
  e.currentTarget.style.transform = 'translateY(0)';
  e.currentTarget.style.boxShadow = 'none';
}}
```

### Real-time Updates
- **Auto-refresh**: Data refreshes every 30 seconds
- **Manual Refresh**: Refresh button on each page
- **Loading States**: Skeleton loaders and spinners

### Responsive Design
- **Mobile-first**: Designed for mobile, scales to desktop
- **Breakpoints**: Adaptive grid layouts
- **Touch-friendly**: Large tap targets for mobile

---

## 🐛 Troubleshooting

### Common Issues

#### 1. **Blank White Page After Deployment**
**Solution**: Ensure base path is uncommented in `vite.config.js` and `basename="/admin"` in `App.jsx`

#### 2. **404 Errors on Refresh**
**Solution**: Check nginx configuration has `try_files` directive

#### 3. **API Calls Failing with 401**
**Solution**: Verify token is being sent in request headers. Check browser console.

#### 4. **Styles Not Loading**
**Solution**: Clear browser cache with hard refresh (Cmd/Ctrl + Shift + R)

#### 5. **Build Fails**
**Solution**: 
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📝 Development Workflow

### Adding a New Page

1. **Create page component**: `src/pages/NewPage.jsx`
2. **Add route**: Update `src/App.jsx`
3. **Add navigation**: Update `src/components/layout/Layout.jsx`
4. **Create service** (if needed): Update `src/services/userService.js`

### Code Style Guidelines

- Use functional components with hooks
- Follow React best practices
- Use meaningful variable names
- Add comments for complex logic
- Keep components focused (single responsibility)
- Use Tailwind classes for styling
- Maintain consistent indentation (2 spaces)

---

## 🤝 Contributing

### Development Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards

- Follow ESLint rules
- Write clean, readable code
- Add comments for complex logic
- Test thoroughly before submitting PR
- Update documentation as needed

---

## 📞 Support

For issues and questions:
- **GitHub Issues**: [Create an issue](https://github.com/sairamreddy7/Admin-Healthapp-Frontend/issues)
- **Email**: support@healthapp.com

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite team for the lightning-fast build tool
- Tailwind CSS for the utility-first approach
- All contributors who helped improve this project

---

## 📈 Changelog

### Version 2.0.0 (Latest)
- ✨ Modernized UI with gradients and glassmorphism
- 🎨 Enhanced dashboard with quick actions
- 💊 Fixed prescriptions page with doctor names
- 💰 Fixed billing statistics calculation
- 🔐 Added clickable user profile
- 📊 Improved test results date handling
- 🚀 Removed active sessions card
- 🎯 Better responsive design

### Version 1.0.0
- Initial release with basic admin functionality
- User, doctor, patient management
- Billing and appointments
- Audit logs

---

**Made with ❤️ by the HealthApp Team**
