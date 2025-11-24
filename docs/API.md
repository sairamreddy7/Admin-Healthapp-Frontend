# API Documentation

## Base URL

```
Production: https://healthapp-beta.eastus.cloudapp.azure.com/api
Development: http://localhost:3000/api
```

## Authentication

All API requests require authentication via JWT Bearer token in the Authorization header.

```http
Authorization: Bearer <token>
```

### Login

**Endpoint:** `POST /auth/staff-ad-login`

**Request:**
```json
{
  "email": "HealthAppSuperAdmin@healthcare-portal.local",
  "password": "H3althApp@2025!"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "admin@hospital.com",
    "role": "ADMIN",
    "firstName": "Admin",
    "lastName": "User"
  }
}
```

---

## Users

### Get All Users

**Endpoint:** `GET /users`

**Query Parameters:**
- `limit` (optional): Number of results (default: 100)
- `offset` (optional): Pagination offset (default: 0)
- `role` (optional): Filter by role (ADMIN, DOCTOR, PATIENT)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "PATIENT",
      "createdAt": "2025-01-15T10:30:00Z"
    }
  ]
}
```

### Get User by ID

**Endpoint:** `GET /users/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "PATIENT",
    "phone": "+1234567890",
    "createdAt": "2025-01-15T10:30:00Z"
  }
}
```

### Delete User

**Endpoint:** `DELETE /users/:id`

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## Doctors

### Get All Doctors

**Endpoint:** `GET /doctors`

**Query Parameters:**
- `limit` (optional): Number of results
- `specialization` (optional): Filter by specialization

**Response:**
```json
{
  "success": true,
  "data": {
    "doctors": [
      {
        "id": "uuid",
        "firstName": "Jane",
        "lastName": "Smith",
        "email": "dr.smith@hospital.com",
        "specialization": "Cardiology",
        "qualifications": "MD, FACC",
        "experience": 15,
        "phone": "+1234567890",
        "createdAt": "2025-01-10T08:00:00Z"
      }
    ]
  }
}
```

### Get Doctor by ID

**Endpoint:** `GET /doctors/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "firstName": "Jane",
    "lastName": "Smith",
    "specialization": "Cardiology",
    "qualifications": "MD, FACC",
    "experience": 15,
    "availableSlots": [...]
  }
}
```

---

## Patients

### Get All Patients

**Endpoint:** `GET /patients`

**Query Parameters:**
- `limit` (optional): Number of results (default: 100)

**Response:**
```json
{
  "success": true,
  "data": {
    "patients": [
      {
        "id": "uuid",
        "userId": "user-uuid",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "dateOfBirth": "1990-05-15",
        "gender": "MALE",
        "bloodGroup": "A+",
        "phone": "+1234567890",
        "address": "123 Main St",
        "emergencyContact": "+0987654321",
        "medicalHistory": "None",
        "allergies": "Penicillin",
        "invoices": [...],
        "createdAt": "2025-01-15T10:30:00Z"
      }
    ]
  }
}
```

### Get Patient by ID

**Endpoint:** `GET /patients/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "dateOfBirth": "1990-05-15",
    "gender": "MALE",
    "medicalHistory": "Hypertension",
    "appointments": [...],
    "prescriptions": [...],
    "testResults": [...]
  }
}
```

### Create Patient

**Endpoint:** `POST /patients`

**Request:**
```json
{
  "userId": "user-uuid",
  "dateOfBirth": "1990-05-15",
  "gender": "MALE",
  "bloodGroup": "A+",
  "phone": "+1234567890",
  "address": "123 Main St",
  "emergencyContact": "+0987654321"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "patient-uuid",
    "userId": "user-uuid",
    "dateOfBirth": "1990-05-15",
    "gender": "MALE",
    "createdAt": "2025-01-15T10:30:00Z"
  }
}
```

### Delete Patient

**Endpoint:** `DELETE /patients/:id`

**Response:**
```json
{
  "success": true,
  "message": "Patient deleted successfully"
}
```

---

## Appointments

### Get All Appointments

**Endpoint:** `GET /appointments`

**Query Parameters:**
- `status` (optional): SCHEDULED, COMPLETED, CANCELLED
- `doctorId` (optional): Filter by doctor
- `patientId` (optional): Filter by patient

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "patientId": "patient-uuid",
      "doctorId": "doctor-uuid",
      "appointmentDate": "2025-01-20T14:00:00Z",
      "status": "SCHEDULED",
      "reason": "Regular checkup",
      "notes": "Patient has mild fever",
      "patient": {
        "firstName": "John",
        "lastName": "Doe"
      },
      "doctor": {
        "firstName": "Jane",
        "lastName": "Smith",
        "specialization": "Cardiology"
      }
    }
  ]
}
```

---

## Prescriptions (Medications)

### Get All Prescriptions

**Endpoint:** `GET /medications`

**Query Parameters:**
- `limit` (optional): Number of results
- `status` (optional): ACTIVE, COMPLETED, CANCELLED

**Response:**
```json
{
  "success": true,
  "data": {
    "prescriptions": [
      {
        "id": "uuid",
        "medicationName": "Metformin",
        "dosage": "500mg",
        "frequency": "Twice daily",
        "duration": "30 days",
        "instructions": "Take with meals",
        "status": "ACTIVE",
        "prescribedDate": "2025-01-15T10:00:00Z",
        "doctorName": "Dr. Jane Smith",
        "doctorSpecialization": "Endocrinology",
        "refillDue": "2025-02-14T10:00:00Z"
      }
    ]
  }
}
```

---

## Test Results

### Get All Test Results

**Endpoint:** `GET /test-results`

**Query Parameters:**
- `patientId` (optional): Filter by patient
- `status` (optional): PENDING, COMPLETED, REVIEWED

**Response:**
```json
{
  "success": true,
  "data": {
    "testResults": [
      {
        "id": "uuid",
        "patientId": "patient-uuid",
        "testName": "Complete Blood Count",
        "testType": "Blood Test",
        "status": "COMPLETED",
        "testDate": "2025-01-15T09:00:00Z",
        "results": "Normal",
        "notes": "All values within range",
        "patient": {
          "firstName": "John",
          "lastName": "Doe"
        }
      }
    ]
  }
}
```

---

## Billing/Invoices

### Get All Invoices

**Note:** Admin portal fetches invoices from the patients endpoint as each patient object contains their invoices.

**Endpoint:** `GET /patients` (with limit=1000)

**Response includes invoices array for each patient:**
```json
{
  "success": true,
  "data": {
    "patients": [
      {
        "id": "patient-uuid",
        "firstName": "John",
        "lastName": "Doe",
        "invoices": [
          {
            "id": "invoice-uuid",
            "amount": 250.00,
            "status": "PAID",
            "description": "Consultation fee",
            "dueDate": "2025-01-20",
            "paidDate": "2025-01-18",
            "createdAt": "2025-01-15T10:00:00Z"
          }
        ]
      }
    ]
  }
}
```

---

## Audit Logs

### Get Audit Logs

**Endpoint:** `GET /audit-logs`

**Query Parameters:**
- `limit` (optional): Number of results
- `offset` (optional): Pagination offset
- `action` (optional): Filter by action type
- `userId` (optional): Filter by user

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "userId": "user-uuid",
      "action": "USER_LOGIN",
      "resource": "auth",
      "details": "Admin login successful",
      "ipAddress": "192.168.1.100",
      "userAgent": "Mozilla/5.0...",
      "timestamp": "2025-01-15T10:30:00Z"
    }
  ]
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message"
  }
}
```

### Common Error Codes

| HTTP Status | Error Code | Description |
|------------|------------|-------------|
| 400 | `VALIDATION_ERROR` | Request validation failed |
| 401 | `UNAUTHORIZED` | Missing or invalid authentication |
| 403 | `FORBIDDEN` | User lacks required permissions |
| 404 | `NOT_FOUND` | Resource not found |
| 409 | `CONFLICT` | Resource already exists |
| 500 | `INTERNAL_ERROR` | Server error |

### Example Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required"
  }
}
```

---

## Rate Limiting

- **Limit:** 100 requests per minute per IP
- **Response when exceeded:**
  ```json
  {
    "success": false,
    "error": {
      "code": "RATE_LIMIT_EXCEEDED",
      "message": "Too many requests. Please try again later."
    }
  }
  ```

---

## Integration Example

### JavaScript/React Integration

```javascript
import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: 'https://healthapp-beta.eastus.cloudapp.azure.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Usage example
const getPatients = async () => {
  try {
    const response = await api.get('/patients');
    return response.data;
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }
};
```

---

## Webhooks (Future Feature)

Webhook support is planned for future releases to enable real-time notifications for:
- New appointments
- Updated prescriptions
- Test result completions
- Payment status changes

---

## Changelog

### API v2.0
- Added Active Directory authentication
- Enhanced error responses
- Added pagination support
- Improved rate limiting

### API v1.0
- Initial release
- Basic CRUD operations
- JWT authentication
