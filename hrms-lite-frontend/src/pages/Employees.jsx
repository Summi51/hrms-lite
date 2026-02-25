import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  Snackbar,
  Tooltip,
  Divider,
  Avatar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import { getEmployees, addEmployee, deleteEmployee } from "../api/api";

const EMPTY_FORM = { employeeId: "", fullName: "", email: "", department: "" };

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add dialog
  const [openAdd, setOpenAdd] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [adding, setAdding] = useState(false);

  // Delete dialog
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Snackbar
  const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });

  const showSnack = (msg, severity = "success") =>
    setSnack({ open: true, msg, severity });

  const fetchEmployees = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getEmployees();
      setEmployees(res.data.data);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // ── Add Employee ────────────────────────────────────────────
  const handleFormChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAdd = async () => {
    const { employeeId, fullName, email, department } = form;
    if (!employeeId || !fullName || !email || !department) {
      setFormError("All fields are required");
      return;
    }
    setAdding(true);
    setFormError("");
    try {
      await addEmployee({ employeeId, fullName, email, department });
      setOpenAdd(false);
      setForm(EMPTY_FORM);
      fetchEmployees();
      showSnack("Employee added successfully");
    } catch (err) {
      setFormError(err.response?.data?.msg || "Failed to add employee");
    } finally {
      setAdding(false);
    }
  };

  // ── Delete Employee ─────────────────────────────────────────
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteEmployee(deleteTarget._id);
      setDeleteTarget(null);
      fetchEmployees();
      showSnack("Employee deleted successfully");
    } catch (err) {
      showSnack(err.response?.data?.msg || "Failed to delete employee", "error");
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box className="animate-fade-in" sx={{ p: { xs: 2, sm: 4 } }}>
      {/* Premium Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography
            variant="h4"
            fontWeight={600}
            sx={{
              color: "#111",
              mb: 0.5,
              letterSpacing: "-0.5px",
            }}
          >
            Employees
          </Typography>
          <Typography variant="body1" color="text.secondary" fontWeight={500}>
            Manage your team members
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setOpenAdd(true);
            setFormError("");
            setForm(EMPTY_FORM);
          }}
          sx={{
            borderRadius: 2,
            px: 4,
            py: 1.5,
            bgcolor: "#111",
            color: "white",
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            "&:hover": {
              bgcolor: "#333",
              transform: "translateY(-1px)",
              boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
            },
            transition: "all 0.3s ease",
          }}
        >
          Add Employee
        </Button>
      </Box>

      {/* Errors */}
      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "error.light",
          }}
        >
          {error}
        </Alert>
      )}

      {/* Premium Table Card */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 4,
          border: "1px solid #eaeaea",
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.02)",
          overflow: "hidden",
          bgcolor: "white",
        }}
      >
        <Box
          sx={{
            p: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight={800} color="#111" sx={{ letterSpacing: "-0.5px" }}>
              Employee Directory
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ mt: 0.5 }}>
              Total: {employees.length} employee{employees.length !== 1 ? "s" : ""}
            </Typography>
          </Box>
        </Box>
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box display="flex" justifyContent="center" py={6}>
              <CircularProgress sx={{ color: "primary.main" }} />
            </Box>
          ) : employees.length === 0 ? (
            <Box textAlign="center" py={8}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "#f0f0f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto",
                  mb: 2,
                }}
              >
                <PersonIcon sx={{ fontSize: 40, color: "#999" }} />
              </Box>
              <Typography variant="h6" fontWeight={600} color="text.primary" mb={1}>
                No employees yet
              </Typography>
              <Typography color="text.secondary">
                Get started by adding your first employee
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: "text.secondary",
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        borderBottom: "2px solid",
                        borderColor: "divider",
                        bgcolor: "rgba(99, 102, 241, 0.04)",
                      }}
                    >
                      Employee ID
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: "text.secondary",
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        borderBottom: "2px solid",
                        borderColor: "divider",
                        bgcolor: "rgba(99, 102, 241, 0.04)",
                      }}
                    >
                      Full Name
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: "text.secondary",
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        borderBottom: "2px solid",
                        borderColor: "divider",
                        bgcolor: "rgba(99, 102, 241, 0.04)",
                      }}
                    >
                      Email
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: "text.secondary",
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        borderBottom: "2px solid",
                        borderColor: "divider",
                        bgcolor: "rgba(99, 102, 241, 0.04)",
                      }}
                    >
                      Department
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: "text.secondary",
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        borderBottom: "2px solid",
                        borderColor: "divider",
                        bgcolor: "rgba(99, 102, 241, 0.04)",
                      }}
                    >
                      Joined
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: 700,
                        color: "text.secondary",
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        borderBottom: "2px solid",
                        borderColor: "divider",
                        bgcolor: "rgba(99, 102, 241, 0.04)",
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employees.map((emp) => (
                    <TableRow
                      key={emp._id}
                      sx={{
                        "&:last-child td": { borderBottom: 0 },
                      }}
                    >
                      <TableCell sx={{ borderBottom: "1px solid #eaeaea", py: 2.5, pl: 3 }}>
                        <Typography variant="body2" fontWeight={600} color="#111">{emp.employeeId}</Typography>
                      </TableCell>
                      <TableCell sx={{ borderBottom: "1px solid #eaeaea", py: 2.5 }}>
                        <Box display="flex" alignItems="center" gap={1.5}>
                          <Avatar sx={{ width: 36, height: 36, bgcolor: "#c5ef5d", color: "#111", fontSize: "0.9rem", fontWeight: 700 }}>
                            {emp.fullName.charAt(0)}
                          </Avatar>
                          <Typography variant="body2" fontWeight={600} sx={{ color: "#111" }}>{emp.fullName}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.875rem", color: "text.secondary", borderBottom: "1px solid #eaeaea", py: 2.5, fontWeight: 500 }}>
                        {emp.email}
                      </TableCell>
                      <TableCell sx={{ borderBottom: "1px solid #eaeaea", py: 2.5 }}>
                        <Chip
                          label={emp.department}
                          size="small"
                          sx={{
                            bgcolor: "white",
                            border: "1px solid #eaeaea",
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            color: "text.secondary",
                            px: 1
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.875rem", color: "text.secondary", borderBottom: "1px solid #eaeaea", py: 2.5, fontWeight: 500 }}>
                        {new Date(emp.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="right" sx={{ borderBottom: "1px solid #eaeaea", py: 2.5, pr: 3 }}>
                        <Tooltip title="Delete Employee">
                          <IconButton
                            size="small"
                            onClick={() => setDeleteTarget(emp)}
                            sx={{
                              color: "#888",
                              bgcolor: "rgba(0,0,0,0.02)",
                              "&:hover": {
                                bgcolor: "error.main",
                                color: "white",
                              },
                              transition: "all 0.2s ease",
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* ── Premium Add Employee Dialog ───────────────────────────────── */}
      <Dialog
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        <Box
          sx={{
            bgcolor: "#111",
            color: "white",
            p: 3,
          }}
        >
          <Typography variant="h5" fontWeight={700}>
            Add New Employee
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
            Fill in the details to add a new team member
          </Typography>
        </Box>
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          {formError && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "error.light",
              }}
            >
              {formError}
            </Alert>
          )}
          <TextField
            label="Employee ID"
            name="employeeId"
            value={form.employeeId}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            placeholder="e.g. EMP001"
            sx={{
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: "primary.main",
                },
              },
            }}
          />
          <TextField
            label="Full Name"
            name="fullName"
            value={form.fullName}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            sx={{
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: "primary.main",
                },
              },
            }}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            sx={{
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: "primary.main",
                },
              },
            }}
          />
          <TextField
            label="Department"
            name="department"
            value={form.department}
            onChange={handleFormChange}
            fullWidth
            margin="normal"
            placeholder="e.g. Engineering"
            sx={{
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: "primary.main",
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={() => setOpenAdd(false)}
            disabled={adding}
            sx={{
              borderRadius: 2,
              px: 3,
              color: "text.secondary",
              "&:hover": {
                bgcolor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAdd}
            disabled={adding}
            startIcon={adding ? <CircularProgress size={16} /> : <AddIcon />}
            sx={{
              borderRadius: 2,
              px: 3,
              bgcolor: "#c5ef5d",
              color: "black",
              "&:hover": {
                bgcolor: "#b2de4a",
              },
            }}
          >
            {adding ? "Adding..." : "Add Employee"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Delete Confirm Dialog ─────────────────────────────── */}
      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle fontWeight={700} color="error">
          Delete Employee
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Typography>
            Are you sure you want to delete{" "}
            <strong>{deleteTarget?.fullName}</strong> (
            {deleteTarget?.employeeId})? All their attendance records will also
            be deleted.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteTarget(null)} disabled={deleting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={16} /> : <DeleteIcon />}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          severity={snack.severity}
          variant="filled"
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
