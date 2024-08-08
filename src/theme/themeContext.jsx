import React, { createContext, useState, useMemo, useContext } from 'react';
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { GlobalStyles } from '@mui/system';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('dark');

  const commonProperties = {
    typography: {
      fontFamily: 'Roboto, Arial, sans-serif',
      fontSize: 14,
      h1: { fontSize: '2.5rem', fontWeight: 500 },
      h2: { fontSize: '2rem', fontWeight: 500 },
      h3: { fontSize: '1.75rem', fontWeight: 500 },
      h4: { fontSize: '1.5rem', fontWeight: 500 },
      h5: { fontSize: '1.25rem', fontWeight: 500 },
      h6: { fontSize: '1rem', fontWeight: 500 },
      body1: { fontSize: '1rem' },
      body2: { fontSize: '0.875rem' },
      button: { textTransform: 'none' },
    },
    spacing: 8,
    breakpoints: {
      values: { xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 },
    },
    components: {
      MuiButton: { styleOverrides: { root: { borderRadius: '8px' } } },
      MuiTextField: { styleOverrides: { root: { marginBottom: '16px' } } },
    },
  };

  const lightTheme = createTheme({
    palette: {
      mode: 'light',
      primary: { main: '#1976d2' },
      secondary: { main: '#9c27b0' },
      background: { default: '#ffffff', paper: '#f5f5f5' },
      text: { primary: '#000000', secondary: '#555555' },
    },
    ...commonProperties,
  });

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: { main: '#90caf9' },
      secondary: { main: '#f48fb1' },
      background: { default: '#121212', paper: '#1e1e1e' },
      text: { primary: '#ffffff', secondary: '#bbbbbb' },
    },
    ...commonProperties,
  });

  const theme = useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode]);

  const globalStyles = (
    <GlobalStyles
      styles={{
        body: {
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          transition: 'background-color 0.3s ease, color 0.3s ease',
        },
      }}
    />
  );

  const toggleTheme = () => setMode((prevMode) => (prevMode === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MUIThemeProvider theme={theme}>
        {globalStyles}
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
