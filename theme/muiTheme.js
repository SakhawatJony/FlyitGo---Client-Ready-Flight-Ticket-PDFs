import { createTheme } from "@mui/material/styles";

const muiTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#b88a2b" },
    secondary: { main: "#0f172a" },
    background: {
      default: "#0b0f17",
      paper: "#111827",
    },
    text: {
      primary: "#f5f0e6",
      secondary: "#d1c7b7",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Segoe UI", sans-serif',
    h4: {
      fontFamily: '"Georgia", "Times New Roman", serif',
      fontWeight: 600,
      letterSpacing: "0.02em",
    },
    h6: {
      fontFamily: '"Georgia", "Times New Roman", serif',
      fontWeight: 600,
    },
    subtitle1: {
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      fontSize: "0.8rem",
    },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});

export default muiTheme;
