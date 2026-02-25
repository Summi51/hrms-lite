import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import { registerUser } from "../api/api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "employee",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  // Validate email format
  const isValidEmail = (email) => {
    return /^\S+@\S+\.\S+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate required fields
    if (!form.name.trim()) {
      setError("Please enter your full name");
      return;
    }

    if (!form.email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!isValidEmail(form.email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!form.password) {
      setError("Please enter a password");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (!form.confirmPassword) {
      setError("Please confirm your password");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: form.role,
      });
      navigate("/login", { state: { message: "Registration successful! Please login with your credentials." } });
    } catch (err) {
      // Handle different error scenarios
      if (err.response) {
        // Server responded with an error
        const status = err.response.status;
        const msg = err.response.data?.msg;

        if (status === 409) {
          setError(msg || "An account with this email already exists");
        } else if (status === 400) {
          setError(msg || "Please check your input and try again");
        } else {
          setError(msg || "Registration failed. Please try again.");
        }
      } else if (err.request) {
        // Network error - no response received
        setError("Unable to connect to server. Please check your internet connection.");
      } else {
        // Something else went wrong
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 400, width: "100%" }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
            HRMS Lite
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" mb={3}>
            Create your account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              select
              label="Role"
              name="role"
              value={form.role}
              onChange={handleChange}
              margin="normal"
            >
              <MenuItem value="employee">Employee</MenuItem>
              <MenuItem value="hr">HR</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : "Register"}
            </Button>
          </Box>

          <Typography variant="body2" align="center">
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#1976d2" }}>
              Sign In
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

