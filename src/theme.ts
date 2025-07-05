import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#49A2B8',
      contrastText: '#fff'
    },
    secondary: {
      main: '#205e72'
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: '#49A2B8',
        },
      },
    },
  }
});

export default theme;
