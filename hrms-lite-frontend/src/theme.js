import { createTheme } from "@mui/material/styles";

// Premium color palette based on screenshot
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#c5ef5d", // Lime Green from screenshot
      light: "#d5f383",
      dark: "#A3D133",
      contrastText: "#000000",
    },
    secondary: {
      main: "#000000", // Black
      light: "#333333",
      dark: "#000000",
      contrastText: "#ffffff",
    },
    success: {
      main: "#c5ef5d",
      light: "#d5f383",
      dark: "#A3D133",
    },
    error: {
      main: "#EF4444",
    },
    background: {
      default: "#EBECE8", // Grayish beige outer background
      paper: "#ffffff",
    },
    text: {
      primary: "#111111",
      secondary: "#666666",
    },
    divider: "#f0f0f0", // Very light gray divider
  },
  typography: {
    fontFamily: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "sans-serif",
    ].join(","),
    h1: {
      fontWeight: 600,
      fontSize: "2.5rem",
      letterSpacing: "-0.02em",
    },
    h2: {
      fontWeight: 600,
      fontSize: "2rem",
      letterSpacing: "-0.01em",
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.75rem",
    },
    h4: {
      fontWeight: 500,
      fontSize: "1.5rem",
    },
    h5: {
      fontWeight: 500,
      fontSize: "1.25rem",
      letterSpacing: "-0.01em",
    },
    h6: {
      fontWeight: 500,
      fontSize: "1.125rem",
      letterSpacing: "-0.01em",
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: "0.875rem",
    },
    subtitle2: {
      fontWeight: 600,
      fontSize: "0.8rem",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      color: "#666666",
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 16,
  },
  // Subdued shadows to match the clean look
  shadows: [
    "none",
    "0px 2px 4px rgba(0,0,0,0.02)",
    "0px 4px 8px rgba(0,0,0,0.02)",
    "0px 8px 16px rgba(0,0,0,0.03)",
    "0px 12px 24px rgba(0,0,0,0.03)",
    "0px 16px 32px rgba(0,0,0,0.04)",
    "0px 20px 40px rgba(0,0,0,0.04)",
    "0px 24px 48px rgba(0,0,0,0.05)",
    "0px 2px 8px rgba(197, 239, 93, 0.15)",
    "0px 4px 16px rgba(197, 239, 93, 0.2)",
    "0px 8px 24px rgba(197, 239, 93, 0.25)",
    ...Array(14).fill("0px 8px 24px rgba(0,0,0,0.05)"),
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "6px 16px",
          fontSize: "0.875rem",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
        contained: {
          background: "#c5ef5d",
          color: "#000000",
          "&:hover": {
            background: "#b7df56",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "none",
          border: "1px solid #f0f0f0",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 6, // Slightly square chips like in image
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: "none",
        }
      }
    }
  },
});

export default theme;

