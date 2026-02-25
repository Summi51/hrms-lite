import React, { useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  CssBaseline,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/DashboardOutlined";
import PeopleIcon from "@mui/icons-material/PeopleOutlined";
import BarChartIcon from "@mui/icons-material/BarChartOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import { useAuth } from "../context/AuthContext";

const DRAWER_WIDTH = 240;

const navItems = [
  { label: "Dashboard", path: "/", icon: <DashboardIcon /> },
  { label: "Employees", path: "/employees", icon: <PeopleIcon /> },
  { label: "Attendance", path: "/attendance", icon: <BarChartIcon /> },
];

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate("/login");
  };

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: "white", py: 3 }}>
      {/* Sidebar Header */}
      <Box sx={{ px: 3, display: "flex", alignItems: "center", gap: 1.5, mb: 4 }}>
        <MenuIcon sx={{ fontSize: 24, cursor: "pointer" }} />
        <Typography variant="h6" fontWeight={700} letterSpacing={-0.5} sx={{ color: "#111" }}>
          Hrms
        </Typography>
      </Box>

      {/* Navigation Items */}
      <List sx={{ px: 2, flexGrow: 1 }}>
        {navItems.map((item) => {
          const active = location.pathname === item.path;

          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false);
                }}
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  px: 2,
                  bgcolor: active ? theme.palette.primary.main : "transparent",
                  color: active ? "black" : "#666",
                  "&:hover": {
                    bgcolor: active ? theme.palette.primary.main : "#f5f5f5",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: active ? "black" : "#666",
                    minWidth: 40,
                    "& svg": { fontSize: 20 },
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: active ? 600 : 500,
                    fontSize: "0.875rem",
                  }}
                />
                {item.badge && (
                  <Box
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      color: "black",
                      borderRadius: "50%",
                      width: 20,
                      height: 20,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                    }}
                  >
                    {item.badge}
                  </Box>
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    // Full Screen Background
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100vh",
        bgcolor: "white",
        overflow: "hidden",
      }}
    >
      <CssBaseline />

      {/* Desktop Sidebar */}
      <Box
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          display: { xs: "none", sm: "block" },
          borderRight: "1px solid #f0f0f0",
        }}
      >
        {drawer}
      </Box>

      {/* Mobile Sidebar */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { width: DRAWER_WIDTH, borderRight: "none" },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            py: 2.5,
            px: { xs: 2, sm: 4 },
            borderBottom: "1px solid transparent",
          }}
        >
          {/* Breadcrumb / Title */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMobileOpen(!mobileOpen)}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 0.5 }}>
              Overview
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 0.5 }}>
              &gt;
            </Typography>
            <Typography variant="body2" fontWeight={600} color="text.primary">
              Dashboard
            </Typography>
          </Box>

          {/* Top Right Actions */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            {/* Search */}
            <Box sx={{ display: "flex", alignItems: "center", color: "text.secondary", cursor: "pointer" }}>
              <SearchIcon sx={{ fontSize: 20, mr: 1 }} />
              <Typography variant="body2">Search</Typography>
            </Box>

            {/* Notifications */}
            <IconButton size="small" sx={{ color: "text.primary" }}>
              <Badge badgeContent={1} color="error" variant="dot">
                <NotificationsNoneIcon sx={{ fontSize: 22 }} />
              </Badge>
            </IconButton>

            {/* Profile Avatar & Menu */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="body2" fontWeight={500} sx={{ display: { xs: "none", md: "block" } }}>
                {user?.name}
              </Typography>
              <Avatar
                onClick={handleProfileClick}
                sx={{
                  width: 32,
                  height: 32,
                  cursor: "pointer",
                  bgcolor: "primary.main",
                }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
            </Box>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle2" fontWeight={600}>{user?.name}</Typography>
                <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
                <Typography variant="caption" display="block" color="primary.main" sx={{ textTransform: "capitalize" }}>
                  {user?.role}
                </Typography>
              </Box>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Page Content */}
        <Box sx={{ flexGrow: 1, overflowY: "auto", overflowX: "hidden" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
