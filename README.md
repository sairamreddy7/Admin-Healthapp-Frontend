# Healthcare Admin Portal - Frontend

React-based admin frontend for managing users, doctors, and patients in the healthcare portal system.

## Features

- 🔐 **Admin Authentication** - Secure login for admin users
- 📊 **Dashboard** - Overview of system statistics
- 👥 **User Management** - View and manage all users
- 🩺 **Doctor Management** - View doctor profiles
- 🏥 **Patient Management** - View patient profiles

## Tech Stack

- **React 18** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Vite** - Build tool and dev server

## Setup

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create `.env` file (already exists):

```env
VITE_API_URL=http://localhost:4000/api
```

### Start Development Server

```bash
npm run dev
```

The admin frontend will run on **http://localhost:5174**

## Login Credentials

```
Email: admin@healthcare.com
Password: Admin@123
```

## Project Structure

```
src/
├── components/
│   └── layout/
│       └── Layout.jsx          # Main layout with sidebar
├── pages/
│   ├── Login.jsx               # Login page
│   ├── Dashboard.jsx           # Dashboard with stats
│   ├── Users.jsx               # User management
│   ├── Doctors.jsx             # Doctor management
│   └── Patients.jsx            # Patient management
├── services/
│   ├── api.js                  # Axios instance with interceptors
│   ├── authService.js          # Authentication service
│   └── userService.js          # User/Doctor/Patient services
├── App.jsx                     # Main app with routing
├── main.jsx                    # Entry point
└── index.css                   # Global styles
```

## Available Pages

- `/login` - Admin login
- `/dashboard` - Dashboard with statistics
- `/users` - User management (view, delete)
- `/doctors` - Doctor profiles
- `/patients` - Patient profiles

## API Integration

The frontend connects to the admin backend API at `http://localhost:4000/api`:

- All requests include JWT token in Authorization header
- Token stored in localStorage
- Automatic redirect to login on 401 errors

## Build for Production

```bash
npm run build
```

Production files will be in the `dist/` directory.

## Deploy

The admin frontend can be deployed to:
- Vercel
- Netlify  
- AWS S3 + CloudFront
- Any static hosting service

Make sure to update `VITE_API_URL` to point to your production admin backend.

## Development Notes

- Server runs on port 5174 (configured in vite.config.js)
- API requests are proxied to backend in development
- JWT token expires after 8 hours
- Inline styles used for simplicity (can be replaced with CSS modules or Tailwind CSS)

## Security

- JWT tokens stored in localStorage
- Automatic logout on token expiration
- Protected routes with authentication check
- CORS configured in backend

## Troubleshooting

### Can't connect to API

Make sure admin backend is running:
```bash
cd ../backend
node server.js
```

### 401 Unauthorized

Token may have expired. Logout and login again.

### Port 5174 already in use

Change port in `vite.config.js`:
```javascript
export default defineConfig({
  server: {
    port: 5175 // Change to any available port
  }
})
```

## License

MIT
