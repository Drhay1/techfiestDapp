import { extendTheme } from '@chakra-ui/react';

const colors = {
  white: '#ffffff',
  black: '#000',
  brand: {
    primary: '#0F5EFE',
    secondary: '#1D2939',
    lightsecondary: '#667085',
    tertiary: '#3C4D6D',
    dark: {
      100: '#000000',
      200: '#1e1e1e',
      300: '#2d2d2d',
      400: '#3c3c3c',
      500: '#4b4b4b',
      600: '#5a5a5a',
      700: '#696969',
      800: '#787878',
      900: '#878787',
      1000: '#D0D5DD',
    },
    accent: { 100: '#A7FF37', 900: '#426A00' },
    success: '#8ADD21',
    danger: '#DD2121',
  },
};

const breakpoints = {
  sm: '320px',
  md: '768px',
  lg: '960px',
  xl: '1200px',
  r: '1280px',
  xll: '1440px',
  '2xl': '1536px',
};

const styles = {
  global: () => ({
    html: {
      scrollBehavior: 'smooth',
    },
    body: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: '400',
      background: '#EFF4FE',
      color: 'rgba(0, 17, 49, 1)',
      transition: 'all 0.2s ease-in-out',
      fontSize: '1rem',
    },
    button: {
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      '&:focus': {
        outline: 'none',
      },
      minHeight: '48px',
    },
    a: {
      cursor: 'pointer',
      padding: 'unset',
      margin: 'unset',
      transition: 'all 0.2s ease-in-out',
      '&:focus': {
        outline: 'none',
      },
      textDecoration: 'none',
    },
    img: {
      userSelect: 'none',
    },
    select: {
      background: 'none',
      boxShadow: 'none',
      border: 'none',
      hover: 'unset',
      cursor: 'pointer',
    },
  }),
};

export const theme = extendTheme({ styles, colors, breakpoints });

export const hexToRgbWithOpacity = (hex: string, opacity: number) => {
  const normalizedHex = hex.replace('#', '');
  const red = parseInt(normalizedHex.substring(0, 2), 16);
  const green = parseInt(normalizedHex.substring(2, 4), 16);
  const blue = parseInt(normalizedHex.substring(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
};
