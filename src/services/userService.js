// src/services/userService.js
import api from "./api";

export const userService = {
  getAll: async () => {
    try {
      // Try the /users endpoint first
      return await api.get("/users");
    } catch {
      // If /users doesn't exist, combine doctors and patients data
      console.warn("Users endpoint not available, combining doctors and patients");
      const [doctorsRes, patientsRes] = await Promise.all([
        api.get("/doctors").catch(() => ({ data: { success: true, data: [] } })),
        api
          .get("/patients", { params: { limit: 1000 } })
          .catch(() => ({ data: { success: true, data: { patients: [] } } })),
      ]);

      const doctors = doctorsRes.data?.data || [];
      const patients = patientsRes.data?.data?.patients || [];

      const users = [];

      // Add doctors as users
      doctors.forEach((doctor) => {
        users.push({
          id: doctor.userId,
          email:
            doctor.email ||
            `${doctor.firstName}.${doctor.lastName}@healthcare.com`.toLowerCase(),
          username:
            doctor.name?.replace(" ", "").toLowerCase() ||
            `doctor${String(doctor.id || "").substring(0, 8)}`,
          role: "DOCTOR",
          firstName: doctor.firstName,
          lastName: doctor.lastName,
          isActive: true,
          createdAt: doctor.createdAt || new Date().toISOString(),
        });
      });

      // Add patients as users
      patients.forEach((patient) => {
        users.push({
          id: patient.userId,
          email:
            patient.user?.email ||
            patient.email ||
            `${patient.firstName}.${patient.lastName}@healthcare.com`.toLowerCase(),
          username:
            patient.user?.username ||
            patient.username ||
            `patient${String(patient.id || "").substring(0, 8)}`,
          role: "PATIENT",
          firstName: patient.firstName,
          lastName: patient.lastName,
          isActive: true,
          createdAt: patient.createdAt || new Date().toISOString(),
        });
      });

      return { data: users };
    }
  },
  getStats: () => api.get("/users/stats"),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post("/users", data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

export const doctorService = {
  getAll: () => api.get("/doctors"),
  getStats: () => api.get("/doctors/stats"),
  getById: (id) => api.get(`/doctors/${id}`),
  create: (data) => api.post("/doctors", data),
  update: (id, data) => api.put(`/doctors/${id}`, data),
  delete: (id) => api.delete(`/doctors/${id}`),
};

export const patientService = {
  getAll: () => api.get("/patients"),
  getStats: () => api.get("/patients/stats"),
  getById: (id) => api.get(`/patients/${id}`),
  create: (data) => api.post("/patients", data),
  update: (id, data) => api.put(`/patients/${id}`, data),
  delete: (id) => api.delete(`/patients/${id}`),
};

export const appointmentService = {
  getAll: (params) => api.get("/appointments", { params }),
  getStats: () => api.get("/appointments/stats"),
  getById: (id) => api.get(`/appointments/${id}`),
  cancel: (id, data) => api.patch(`/appointments/${id}/cancel`, data),
};

export const billingService = {
  getAllInvoices: async (params) => {
    try {
      // Primary billing invoices endpoint
      return await api.get("/billing/invoices", { params });
    } catch {
      console.log("Billing endpoint not available, fetching invoices from patients");

      try {
        const patientsRes = await api.get("/patients", { params: { limit: 1000 } });
        const patients = patientsRes.data?.data?.patients || [];

        const allInvoices = [];
        for (const patient of patients) {
          if (patient.invoices && Array.isArray(patient.invoices)) {
            patient.invoices.forEach((invoice) => {
              allInvoices.push({
                ...invoice,
                patient: {
                  firstName: patient.firstName,
                  lastName: patient.lastName,
                  id: patient.id,
                },
                amount: invoice.amountCents
                  ? (invoice.amountCents / 100).toFixed(2)
                  : "0.00",
                status:
                  invoice.status === "DUE"
                    ? "PENDING"
                    : invoice.status === "PAID"
                      ? "PAID"
                      : "CANCELLED",
              });
            });
          }
        }

        allInvoices.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        return { data: { data: allInvoices, success: true } };
      } catch (err) {
        console.error("Error fetching invoices from patients:", err);
        return { data: { data: [], success: false } };
      }
    }
  },
  getStats: async () => {
    try {
      return await api.get("/billing/stats");
    } catch {
      console.log("Stats endpoint not available, calculating from invoices");

      try {
        const invoicesRes = await billingService.getAllInvoices({ limit: 1000 });
        const invoices = invoicesRes.data?.data || [];

        const totalRevenue = invoices
          .filter((inv) => inv.status === "PAID")
          .reduce((sum, inv) => sum + parseFloat(inv.amount || 0), 0);

        const pendingAmount = invoices
          .filter((inv) => inv.status === "PENDING" || inv.status === "OVERDUE")
          .reduce((sum, inv) => sum + parseFloat(inv.amount || 0), 0);

        const today = new Date();
        const thisMonth = today.getMonth();
        const thisYear = today.getFullYear();
        const thisMonthRevenue = invoices
          .filter((inv) => {
            const invDate = new Date(inv.createdAt);
            return (
              inv.status === "PAID" &&
              invDate.getMonth() === thisMonth &&
              invDate.getFullYear() === thisYear
            );
          })
          .reduce((sum, inv) => sum + parseFloat(inv.amount || 0), 0);

        return {
          data: {
            data: {
              totalRevenue: totalRevenue.toFixed(2),
              pendingAmount: pendingAmount.toFixed(2),
              thisMonthRevenue: thisMonthRevenue.toFixed(2),
              total: invoices.length,
            },
            success: true,
          },
        };
      } catch (err) {
        console.error("Error calculating stats:", err);
        return { data: { data: null, success: false } };
      }
    }
  },
  getInvoiceById: (id) => api.get(`/billing/invoices/${id}`),
};

export const prescriptionService = {
  getAll: async (params) => {
    try {
      // Backend list endpoint for prescriptions/medications
      return await api.get("/medications", { params });
    } catch {
      console.log(
        "Medications endpoint not available, fetching prescriptions from patients"
      );

      try {
        const patientsRes = await api.get("/patients", { params: { limit: 1000 } });
        const patients = patientsRes.data?.data?.patients || [];

        const allPrescriptions = [];
        for (const patient of patients) {
          if (patient.prescriptions && Array.isArray(patient.prescriptions)) {
            patient.prescriptions.forEach((prescription) => {
              allPrescriptions.push({
                ...prescription,
                patient: {
                  id: patient.id,
                  firstName: patient.firstName,
                  lastName: patient.lastName,
                },
                status: prescription.status || "ACTIVE",
              });
            });
          }
        }

        allPrescriptions.sort(
          (a, b) =>
            new Date(b.prescribedDate || b.createdAt) -
            new Date(a.prescribedDate || a.createdAt)
        );

        return {
          data: {
            data: { prescriptions: allPrescriptions },
            success: true,
          },
        };
      } catch (err) {
        console.error("Error fetching prescriptions from patients:", err);
        return {
          data: {
            data: { prescriptions: [] },
            success: false,
          },
        };
      }
    }
  },
  getStats: () => api.get("/medications/stats"),
  getById: (id) => api.get(`/medications/${id}`),
};

export const testResultService = {
  getAll: async (params) => {
    try {
      // Primary backend endpoint for test results
      const res = await api.get("/test-results", { params });
      const payload = res.data?.data;

      let testResults = [];

      // Support various shapes:
      // - { data: { items: [...] } }
      // - { data: { testResults: [...] } }
      // - { data: [...] }
      if (Array.isArray(payload)) {
        testResults = payload;
      } else if (Array.isArray(payload?.items)) {
        testResults = payload.items;
      } else if (Array.isArray(payload?.testResults)) {
        testResults = payload.testResults;
      }

      return {
        data: {
          data: { testResults },
          success: true,
        },
      };
    } catch {
      console.log(
        "Test results endpoint not available, fetching from medical records"
      );

      try {
        const patientsRes = await api.get("/patients", { params: { limit: 1000 } });
        const patients = patientsRes.data?.data?.patients || [];

        const allTestResults = [];
        for (const patient of patients) {
          if (patient.medicalRecords && Array.isArray(patient.medicalRecords)) {
            patient.medicalRecords.forEach((record) => {
              allTestResults.push({
                ...record,
                patient: {
                  id: patient.id,
                  firstName: patient.firstName,
                  lastName: patient.lastName,
                },
                testName: record.diagnosis,
                testType: record.treatment ? "Treatment" : "Diagnostic",
                testDate: record.visitDate,
                status: "COMPLETED",
              });
            });
          }
        }

        allTestResults.sort(
          (a, b) =>
            new Date(b.visitDate || b.createdAt) -
            new Date(a.visitDate || a.createdAt)
        );

        return {
          data: {
            data: { testResults: allTestResults },
            success: true,
          },
        };
      } catch (err) {
        console.error("Error fetching test results from medical records:", err);
        return {
          data: {
            data: { testResults: [] },
            success: false,
          },
        };
      }
    }
  },
  getStats: () => api.get("/test-results/stats"),
  getById: (id) => api.get(`/test-results/${id}`),
};

export const messageService = {
  getAllThreads: async (params) => {
    try {
      // Primary messages threads endpoint
      return await api.get("/messages/threads", { params });
    } catch {
      console.log(
        "Messages endpoint not available, trying alternative /threads endpoint"
      );

      try {
        const threadsRes = await api.get("/threads", {
          params: { limit: 1000 },
        });
        const threads =
          threadsRes.data?.data?.threads || threadsRes.data?.data || [];

        threads.sort(
          (a, b) =>
            new Date(b.updatedAt || b.createdAt) -
            new Date(a.updatedAt || a.createdAt)
        );

        return {
          data: {
            data: { threads },
            success: true,
          },
        };
      } catch (err) {
        console.error("Error fetching message threads:", err);
        return {
          data: {
            data: { threads: [] },
            success: false,
          },
        };
      }
    }
  },
  getStats: () => api.get("/messages/stats"),
  getThreadById: (id) => api.get(`/messages/threads/${id}`),
};