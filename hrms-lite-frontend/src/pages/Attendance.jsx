import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  Snackbar,
  Divider,
  Tooltip,
  Avatar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { getEmployees, markAttendance, getAttendance, deleteAttendance } from "../api/api";

const today = new Date().toISOString().split("T")[0];

export default function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [records, setRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const [error, setError] = useState("");

  // Mark form state
  const [form, setForm] = useState({ employeeId: "", date: today, status: "Present" });
  const [formError, setFormError] = useState("");
  const [marking, setMarking] = useState(false);

  // Filter date for records
  const [filterDate, setFilterDate] = useState(today);

  // Snackbar
  const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });
  const showSnack = (msg, severity = "success") =>
    setSnack({ open: true, msg, severity });

  // Delete
  const [deletingId, setDeletingId] = useState(null);

  const fetchEmployees = async () => {
    try {
      const res = await getEmployees();
      setEmployees(res.data.data);
    } catch {
      // silently fail; employees still shown in mark form
    }
  };

  const fetchRecords = async (date) => {
    setLoadingRecords(true);
    setError("");
    try {
      const res = await getAttendance(date);
      setRecords(res.data.data);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to load attendance");
    } finally {
      setLoadingRecords(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchRecords(today);
  }, []);

  // ── Mark Attendance ─────────────────────────────────────────
  const handleMark = async () => {
    const { employeeId, date, status } = form;
    if (!employeeId || !date || !status) {
      setFormError("All fields are required");
      return;
    }
    setMarking(true);
    setFormError("");
    try {
      const res = await markAttendance({ employeeId, date, status });
      const msg = res.data.data?.msg || "Attendance marked";
      showSnack(msg);
      // Refresh records if marking for the current filtered date
      if (date === filterDate) fetchRecords(filterDate);
    } catch (err) {
      setFormError(err.response?.data?.msg || "Failed to mark attendance");
    } finally {
      setMarking(false);
    }
  };

  // ── Delete Record ───────────────────────────────────────────
  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteAttendance(id);
      fetchRecords(filterDate);
      showSnack("Record deleted");
    } catch (err) {
      showSnack(err.response?.data?.msg || "Failed to delete", "error");
    } finally {
      setDeletingId(null);
    }
  };

  // ── Filter ──────────────────────────────────────────────────
  const handleFilter = () => fetchRecords(filterDate);

  return (
    <Box className="animate-fade-in" sx={{ p: { xs: 2, sm: 4 } }}>
      {/* Premium Header */}
      <Box mb={4}>
        <Typography
          variant="h4"
          fontWeight={600}
          sx={{
            color: "#111",
            mb: 0.5,
            letterSpacing: "-0.5px",
          }}
        >
          Attendance
        </Typography>
        <Typography variant="body1" color="text.secondary" fontWeight={500}>
          Mark and view attendance records
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* ── Premium Mark Attendance Card ─────────────────────────── */}
        <Grid item xs={12} md={4}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              border: "1px solid #eaeaea",
              boxShadow: "0 4px 24px rgba(0, 0, 0, 0.02)",
              bgcolor: "white",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                p: 3,
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  bgcolor: "#f0fdf4", // very light green
                  color: "#16a34a",
                  borderRadius: 2,
                  p: 1.5,
                  display: "flex",
                }}
              >
                <EventAvailableIcon />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={800} color="#111" sx={{ letterSpacing: "-0.5px" }}>
                  Mark Attendance
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  Record employee presence
                </Typography>
              </Box>
            </Box>
            <CardContent sx={{ p: 3 }}>
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
                select
                label="Select Employee"
                value={form.employeeId}
                onChange={(e) => setForm((p) => ({ ...p, employeeId: e.target.value }))}
                fullWidth
                size="small"
                sx={{ mb: 2 }}
              >
                {employees.length === 0 ? (
                  <MenuItem value="" disabled>
                    No employees found
                  </MenuItem>
                ) : (
                  employees.map((emp) => (
                    <MenuItem key={emp._id} value={emp._id}>
                      {emp.fullName} ({emp.employeeId})
                    </MenuItem>
                  ))
                )}
              </TextField>

              <TextField
                label="Date"
                type="date"
                value={form.date}
                onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                fullWidth
                size="small"
                sx={{ mb: 2 }}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                select
                label="Status"
                value={form.status}
                onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
                fullWidth
                size="small"
                sx={{ mb: 3 }}
              >
                <MenuItem value="Present">
                  <Chip label="Present" color="success" size="small" sx={{ mr: 1 }} />
                  Present
                </MenuItem>
                <MenuItem value="Absent">
                  <Chip label="Absent" color="error" size="small" sx={{ mr: 1 }} />
                  Absent
                </MenuItem>
              </TextField>

              <Button
                variant="contained"
                fullWidth
                onClick={handleMark}
                disabled={marking}
                startIcon={
                  marking ? <CircularProgress size={16} /> : <EventAvailableIcon />
                }
                sx={{
                  borderRadius: 2,
                  bgcolor: "#111",
                  color: "white",
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: "none",
                  "&:hover": { bgcolor: "#333", transform: "translateY(-1px)", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" },
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  transition: "all 0.3s ease"
                }}
              >
                {marking ? "Saving..." : "Mark Attendance"}
              </Button>

              <Typography variant="caption" color="text.secondary" display="block" mt={1.5}>
                * If attendance already marked for this date, it will be updated.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* ── Attendance Records ───────────────────────────── */}
        <Grid item xs={12} md={8}>
          <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid #eaeaea", boxShadow: "0 4px 24px rgba(0, 0, 0, 0.02)" }}>
            <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
              <Box display="flex" alignItems="center" gap={1.5} mb={3}>
                <Box
                  sx={{
                    bgcolor: "rgba(0,0,0,0.03)",
                    color: "#111",
                    borderRadius: 2,
                    p: 1,
                    display: "flex",
                  }}
                >
                  <FilterAltIcon fontSize="small" />
                </Box>
                <Typography variant="h6" fontWeight={800} color="#111" sx={{ letterSpacing: "-0.5px" }}>
                  Attendance Records
                </Typography>
              </Box>

              {/* Date Filter */}
              <Box display="flex" gap={2} mb={3} alignItems="center">
                <TextField
                  label="Filter by Date"
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  sx={{ width: 200 }}
                />
                <Button
                  variant="contained"
                  onClick={handleFilter}
                  startIcon={<FilterAltIcon fontSize="small" />}
                  sx={{ borderRadius: 2, bgcolor: "#c5ef5d", color: "#111", boxShadow: "none", fontWeight: 600, textTransform: "none", "&:hover": { bgcolor: "#b2de4a", boxShadow: "none" } }}
                >
                  Apply Filter
                </Button>
                <Button
                  variant="text"
                  onClick={() => {
                    setFilterDate("");
                    fetchRecords("");
                  }}
                  sx={{ borderRadius: 2, color: "text.secondary", textTransform: "none", fontWeight: 600 }}
                >
                  Clear
                </Button>
              </Box>

              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

              {loadingRecords ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <CircularProgress />
                </Box>
              ) : records.length === 0 ? (
                <Box textAlign="center" py={6}>
                  <EventAvailableIcon sx={{ fontSize: 60, color: "text.disabled" }} />
                  <Typography color="text.secondary" mt={1}>
                    No attendance records found
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: "#888", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", borderBottom: "1px solid #eaeaea", py: 2, pl: 3 }}>Employee ID</TableCell>
                        <TableCell sx={{ color: "#888", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", borderBottom: "1px solid #eaeaea", py: 2 }}>Name</TableCell>
                        <TableCell sx={{ color: "#888", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", borderBottom: "1px solid #eaeaea", py: 2 }}>Department</TableCell>
                        <TableCell sx={{ color: "#888", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", borderBottom: "1px solid #eaeaea", py: 2 }}>Date</TableCell>
                        <TableCell sx={{ color: "#888", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", borderBottom: "1px solid #eaeaea", py: 2 }}>Status</TableCell>
                        <TableCell sx={{ color: "#888", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", borderBottom: "1px solid #eaeaea", py: 2, pr: 3 }} align="right">
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {records.map((rec) => (
                        <TableRow key={rec._id}>
                          <TableCell sx={{ borderBottom: "1px solid #eaeaea", py: 2, pl: 3 }}>
                            <Typography variant="body2" fontWeight={600} color="#111">{rec.employee?.employeeId || "—"}</Typography>
                          </TableCell>
                          <TableCell sx={{ borderBottom: "1px solid #eaeaea", py: 2 }}>
                            <Box display="flex" alignItems="center" gap={1.5}>
                              <Avatar sx={{ width: 36, height: 36, bgcolor: "#c5ef5d", color: "#111", fontSize: "0.9rem", fontWeight: 700 }}>
                                {rec.employee?.fullName?.charAt(0) || "?"}
                              </Avatar>
                              <Typography variant="body2" fontWeight={600} sx={{ color: "#111" }}>{rec.employee?.fullName || "—"}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ borderBottom: "1px solid #eaeaea", py: 2 }}>
                            <Chip label={rec.employee?.department || "—"} size="small" sx={{ bgcolor: "white", border: "1px solid #eaeaea", fontSize: "0.75rem", fontWeight: 600, color: "text.secondary", px: 1 }} />
                          </TableCell>
                          <TableCell sx={{ borderBottom: "1px solid #eaeaea", py: 2, fontSize: "0.875rem", color: "text.secondary", fontWeight: 500 }}>{rec.date}</TableCell>
                          <TableCell sx={{ borderBottom: "1px solid #eaeaea", py: 2 }}>
                            <Chip
                              label={rec.status}
                              sx={{
                                bgcolor: rec.status === "Present" ? "#f0fdf4" : "#fef2f2",
                                color: rec.status === "Present" ? "#16a34a" : "#dc2626",
                                fontWeight: 700,
                                fontSize: "0.75rem"
                              }}
                              size="small"
                            />
                          </TableCell>
                          <TableCell sx={{ borderBottom: "1px solid #eaeaea", py: 2, pr: 3 }} align="right">
                            <Tooltip title="Delete Record">
                              <IconButton
                                color="error"
                                size="small"
                                onClick={() => handleDelete(rec._id)}
                                disabled={deletingId === rec._id}
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
                                {deletingId === rec._id ? (
                                  <CircularProgress size={16} />
                                ) : (
                                  <DeleteIcon fontSize="small" />
                                )}
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              <Typography variant="caption" color="text.secondary" mt={2} display="block">
                Showing {records.length} record{records.length !== 1 ? "s" : ""}
                {filterDate ? ` for ${filterDate}` : " (all dates)"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
