"use client"
import { createTheme, ThemeOptions } from '@mui/material/styles';
import React, { createContext, useState, useMemo, useContext, ReactNode } from 'react';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';

interface CustomThemeFields {
  breakpoints: {
    values: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
    };
  };
  typography: {
    fontFamily: string;
    h1: {
      fontSize: string;
      fontWeight: number;
    };
    h2: {
      fontSize: string;
      fontWeight: number;
    };
    h3: {
      fontSize: string;
      fontWeight: number;
    };
    subtitle1: {
      fontSize: string;
    };
    body1: {
      fontSize: string;
      lineHeight: number;
    };
    body2: {
      fontSize: string;
      lineHeight: number;
    };
    button: {
      textTransform: string;
    };
    caption: {
      fontSize: string;
    };
  };
  transitions: {
    duration: {
      shortest: number;
      shorter: number;
      short: number;
      standard: number;
      complex: number;
      enteringScreen: number;
      leavingScreen: number;
    };
    easing: {
      easeInOut: string;
      easeOut: string;
      easeIn: string;
      sharp: string;
    };
  };
}

declare module '@mui/material/styles' {
  interface Theme extends CustomThemeFields {}
  interface ThemeOptions extends CustomThemeFields {}
}

const baseTheme: ThemeOptions = {
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontSize: '2.0rem',
      fontWeight: 300,
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 400,
    },
    h3:{
      fontSize: '1.3rem',
      fontWeight: 200,
    },
    subtitle1: {
      fontSize: '1.2rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '1rem',
      lineHeight: 2,
    },
    button: {
      textTransform: 'none',
    },
    caption: {
      fontSize: '.8rem',
    }
  },
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },
};

// Define light palette
const lightPalette = {
  primary: {
    main: '#00897B',
    light: '#4DB6AC',
    dark: '#00695C',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#26A69A',
    light: '#80CBC4',
    dark: '#00796B',
    contrastText: '#ffffff',
  },
  background: {
    default: '#ffffff',
    paper: '#f5f5f5',
  },
  text: {
    primary: '#333333',
    secondary: '#757575',
  },
};

const darkPalette = {
  primary: {
    main: '#4DB6AC',
    light: '#B2DFDB',
    dark: '#00897B',
    contrastText: '#000000',
  },
  secondary: {
    main: '#80CBC4',
    light: '#E0F2F1',
    dark: '#26A69A',
    contrastText: '#000000',
  },
  background: {
    default: '#424242',
    paper: '#303030',
  },
  text: {
    primary: '#ffffff',
    secondary: '#b0bec5',
  },
};

export const lightTheme = createTheme({
  ...baseTheme,
  palette: lightPalette,
});

export const darkTheme = createTheme({
  ...baseTheme,
  palette: darkPalette,
});


const ThemeContext = createContext({ toggleTheme: () => {} });

export function ThemeWrapper({ children }: { children: ReactNode }) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [isDarkMode, setIsDarkMode] = useState(prefersDarkMode);

  const theme = useMemo(
    () => (isDarkMode ? darkTheme : lightTheme),
    [isDarkMode]
  );

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeContext.Provider value={{ toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

// Custom hook to use the theme
export function useCustomTheme() {
  const theme = useTheme();
  const { toggleTheme } = useContext(ThemeContext);
  return { theme, toggleTheme };
}