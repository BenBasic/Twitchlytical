import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
    interface BreakpointOverrides {
        mobileXs: true;
        mobileMed: true;
        smPlus: true;
        smWide: true;
    }
};

export const rankCard = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        mobileXs: 400,
        mobileMed: 520,
        sm: 600,
        smPlus: 680,
        smWide: 780,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },
  });