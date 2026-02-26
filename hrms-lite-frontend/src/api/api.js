import axios from "axios";

const api = axios.create({
  baseURL: "https://hrms-lite-backend-tau.vercel.app/api",
  headers: { "Content-Type": "application/json" },
  timeout: 10000, // 10 second timeout
});

// Add token to requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && token !== "null" && token !== "undefined") {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Handle responses and errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error("Network error:", error.message);
      error.message = "Unable to connect to server. Please check your connection.";
      return Promise.reject(error);
    }

    const status = error.response.status;
    const isAuthRoute = error.config?.url?.includes("/auth/login") ||
      error.config?.url?.includes("/auth/register");

    // Handle 401 - Unauthorized (but not for login/register routes)
    if (status === 401 && !isAuthRoute) {
      console.warn("Session expired or invalid token");
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Only redirect if not already on login page
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    // Handle 403 - Forbidden
    if (status === 403) {
      console.warn("Access denied:", error.response.data?.msg);
    }

    // Handle 500 - Server Error
    if (status >= 500) {
      console.error("Server error:", error.response.data);
    }

    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────────
export const loginUser = (data) => api.post("/auth/login", data);
export const registerUser = (data) => api.post("/auth/register", data);
export const getProfile = () => api.get("/auth/profile");
export const changePassword = (data) => api.put("/auth/change-password", data);

// ── Dashboard ──────────────────────────────────────────────
export const getDashboard = () => api.get("/dashboard");

// ── Employees ──────────────────────────────────────────────
export const getEmployees = () => api.get("/employees");
export const getEmployee = (id) => api.get(`/employees/${id}`);
export const addEmployee = (data) => api.post("/employees", data);
export const deleteEmployee = (id) => api.delete(`/employees/${id}`);

// ── Attendance ─────────────────────────────────────────────
// POST body: { employeeId: <Mongo _id>, date: "YYYY-MM-DD", status: "Present"|"Absent" }
export const markAttendance = (data) => api.post("/attendance", data);
export const getAttendance = (date) =>
  api.get("/attendance", { params: date ? { date } : {} });
export const getEmployeeAttendance = (employeeId) =>
  api.get(`/attendance/employee/${employeeId}`);
export const deleteAttendance = (id) => api.delete(`/attendance/${id}`);

export default api;
