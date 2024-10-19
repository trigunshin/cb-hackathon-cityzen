"use client"
import { Roboto_Slab } from 'next/font/google'
import { createTheme, ThemeOptions } from '@mui/material/styles';
import React, { createContext, useState, useMemo, useContext, ReactNode } from 'react';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';

const robotoSlab = Roboto_Slab({
  subsets: ['latin'],
  variable: '--font-roboto_slab',
  weight: "variable",
  style: ['normal'],
  display: 'swap',
});

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
    fontFamily: robotoSlab.style.fontFamily,
    h1: {
      fontSize: '5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '3rem',
      fontWeight: 400,
    },
    h3:{
      fontSize: '2rem',
      fontWeight: 400,
    },
    subtitle1: {
      fontSize: '1.3rem',
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
      fontSize: '1.2rem',
      fontWeight: 500,
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

const lightPalette = {
  primary: {
    main: '#87bddd',
    light: '#9DCFEC',
    dark: '#4A98C1',
    contrastText: '#565656',
  },
  secondary: {
    main: '#4DBBC7',
    light: '#7ECFD8',
    dark: '#3A8F99',
    contrastText: '#a6a6a6',
  },
  background: {
    default: '#eef4f7',
    paper: '#fcfcf9',
  },
  text: {
    primary: '#464646',
    secondary: '#757575',
  },
};

const darkPalette = {
  primary: {
    main: '#486383',
    light: '#7B97B8',
    dark: '#42648c',
    contrastText: '#c7cbcd',
  },
  secondary: {
    main: '#5a8ab7',
    light: '#6B8AA6',
    dark: '#334D6E',
    contrastText: '#d1d1d1',
  },
  background: {
    default: '#1C2633',
    paper: '#2A3847',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#B0BEC5',
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