import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Avatar,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { getDashboard } from "../api/api";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    getDashboard()
      .then((res) => {
        setData(res.data?.data);
      })
      .catch((err) => {
        setError("Failed to load dashboard data");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress sx={{ color: "#c5ef5d" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const {
    totalEmployees = 0,
    attendance = {},
    departmentCounts = [],
    recentEmployees = [],
    today = "Today",
  } = data || {};

  return (
    <Box className="animate-fade-in" sx={{ p: { xs: 3, md: 5 }, width: "100%" }}>

      {/* Header section */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom sx={{ color: "#111" }}>
            Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            Overview for {today}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton size="small" sx={{ border: "1px solid #f0f0f0" }}>
            <FilterListIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Stat Cards - Styled like the snapshot's top bar */}
      <Box display="flex" flexWrap="wrap" gap={3} mb={6}>
        {/* Black Card: Total Employees */}
        <Paper
          elevation={0}
          sx={{
            bgcolor: "#111",
            color: "white",
            px: 4,
            py: 3,
            borderRadius: "50px",
            minWidth: 200,
            flex: "1 1 calc(25% - 24px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
          }}
        >
          <Typography variant="h3" fontWeight={700} mb={0.5}>{totalEmployees}</Typography>
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>TOTAL EMPLOYEES</Typography>
        </Paper>

        {/* Lime Card: Present Today */}
        <Paper
          elevation={0}
          sx={{
            bgcolor: "#c5ef5d",
            color: "black",
            px: 4,
            py: 3,
            borderRadius: "50px",
            minWidth: 200,
            flex: "1 1 calc(25% - 24px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            boxShadow: "0 10px 30px rgba(197, 239, 93, 0.2)"
          }}
        >
          <Typography variant="h3" fontWeight={700} mb={0.5}>{attendance.totalPresentToday || 0}</Typography>
          <Typography variant="caption" sx={{ color: "rgba(0,0,0,0.6)", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>PRESENT TODAY</Typography>
        </Paper>

        {/* White Card: Absent Today */}
        <Paper
          elevation={0}
          sx={{
            bgcolor: "white",
            border: "1px solid #eaeaea",
            color: "black",
            px: 4,
            py: 3,
            borderRadius: "50px",
            minWidth: 200,
            flex: "1 1 calc(25% - 24px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            boxShadow: "0 4px 20px rgba(0,0,0,0.03)"
          }}
        >
          <Typography variant="h3" fontWeight={700} mb={0.5}>{attendance.totalAbsentToday || 0}</Typography>
          <Typography variant="caption" sx={{ color: "rgba(0,0,0,0.5)", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>ABSENT TODAY</Typography>
        </Paper>

        {/* White Card: Not Marked */}
        <Paper
          elevation={0}
          sx={{
            bgcolor: "white",
            border: "1px solid #eaeaea",
            color: "black",
            px: 4,
            py: 3,
            borderRadius: "50px",
            minWidth: 200,
            flex: "1 1 calc(25% - 24px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            boxShadow: "0 4px 20px rgba(0,0,0,0.03)"
          }}
        >
          <Typography variant="h3" fontWeight={700} mb={0.5}>{attendance.notMarkedToday || 0}</Typography>
          <Typography variant="caption" sx={{ color: "rgba(0,0,0,0.5)", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>NOT MARKED</Typography>
        </Paper>
      </Box>

      {/* Data Tables Area */}
      <Grid container spacing={4}>

        {/* Department Breakdown */}
        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ p: 0, border: "1px solid #eaeaea", borderRadius: "32px", overflow: "hidden", boxShadow: "0 10px 40px rgba(0, 0, 0, 0.03)", bgcolor: "white", height: "100%" }}>
            <Box sx={{ p: 4, pb: 2 }}>
              <Typography variant="h6" fontWeight={800} color="#111" sx={{ letterSpacing: "-0.5px" }}>Department Breakdown</Typography>
            </Box>
            <Table sx={{ minWidth: "100%" }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "#a0a0a0", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", borderBottom: "1px solid #f5f5f5", py: 2, pl: 4, letterSpacing: "1px" }}>Department</TableCell>
                  <TableCell sx={{ color: "#a0a0a0", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", borderBottom: "1px solid #f5f5f5", py: 2, pr: 4, letterSpacing: "1px" }} align="right">Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {departmentCounts && departmentCounts.length > 0 ? departmentCounts.map((dept) => (
                  <TableRow key={dept.department} sx={{ "&:last-child td": { borderBottom: 0 }, "&:hover": { bgcolor: "#fbfbfb" } }}>
                    <TableCell sx={{ fontWeight: 600, color: "#111", borderBottom: "1px solid #f5f5f5", py: 2.5, pl: 4 }}>
                      <Box display="flex" alignItems="center" gap={1.5}>
                        <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#c5ef5d" }} />
                        {dept.department}
                      </Box>
                    </TableCell>
                    <TableCell align="right" sx={{ borderBottom: "1px solid #f5f5f5", py: 2.5, pr: 4 }}>
                      <Typography variant="body2" fontWeight={800} color="#111">{dept.count}</Typography>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={2} sx={{ textAlign: "center", py: 6, color: "#a0a0a0", borderBottom: "none" }}>No data available</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>
        </Grid>

        {/* Recent Employees */}
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ p: 0, border: "1px solid #eaeaea", borderRadius: "32px", overflow: "hidden", boxShadow: "0 10px 40px rgba(0, 0, 0, 0.03)", bgcolor: "white", height: "100%" }}>
            <Box sx={{ p: 4, pb: 2 }}>
              <Typography variant="h6" fontWeight={800} color="#111" sx={{ letterSpacing: "-0.5px" }}>Recently Added Employees</Typography>
            </Box>
            <Table sx={{ minWidth: "100%" }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "#a0a0a0", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", borderBottom: "1px solid #f5f5f5", py: 2, pl: 4, letterSpacing: "1px" }}>Employee</TableCell>
                  <TableCell sx={{ color: "#a0a0a0", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", borderBottom: "1px solid #f5f5f5", py: 2, letterSpacing: "1px" }}>ID</TableCell>
                  <TableCell sx={{ color: "#a0a0a0", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", borderBottom: "1px solid #f5f5f5", py: 2, pr: 4, letterSpacing: "1px" }}>Department</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentEmployees && recentEmployees.length > 0 ? recentEmployees.map((emp) => (
                  <TableRow key={emp._id} sx={{ "&:last-child td": { borderBottom: 0 }, "&:hover": { bgcolor: "#fbfbfb" } }}>
                    <TableCell sx={{ borderBottom: "1px solid #f5f5f5", py: 2.5, pl: 4 }}>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ width: 40, height: 40, bgcolor: "#c5ef5d", color: "#111", fontSize: "1rem", fontWeight: 700 }}>
                          {emp.fullName.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={700} sx={{ color: "#111", mb: 0.25 }}>{emp.fullName}</Typography>
                          <Typography variant="caption" sx={{ color: "#a0a0a0", fontWeight: 500 }}>{emp.email}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ borderBottom: "1px solid #f5f5f5", py: 2.5 }}>
                      <Typography variant="body2" fontWeight={700} color="#111">{emp.employeeId}</Typography>
                    </TableCell>
                    <TableCell sx={{ borderBottom: "1px solid #f5f5f5", py: 2.5, pr: 4 }}>
                      <Typography variant="body2" fontWeight={600} color="#666">{emp.department}</Typography>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={3} sx={{ textAlign: "center", py: 6, color: "#a0a0a0", borderBottom: "none" }}>No data available</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>
        </Grid>

      </Grid>

    </Box>
  );
}
