import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#80c7ed'
    },
    secondary: {
      main: '#c4f2ff',
    },
    background: {
      default: '#e2f9ff', 
    }
  },
  typography: {
    allVariants: {
      fontFamily: "'Nunito', sans-serif",
    }
  }
});

export default theme;