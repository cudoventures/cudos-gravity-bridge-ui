import * as React from "react";
import MuiButton, { ButtonProps } from "@mui/material/Button";

import {
  createTheme,
  ThemeProvider,
  PaletteColorOptions,
} from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface CustomPalette {
    tertiary: PaletteColorOptions;
  }
  interface Palette extends CustomPalette {}
  interface PaletteOptions extends CustomPalette {}
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    tertiary: true;
  }
}

const theme = createTheme({
  palette: {
    action: {
      disabled: "#fff",
      disabledBackground: "rgba(54, 62, 89, 1)",
    },
    primary: {
      main: "rgb(85, 146, 247)",
      contrastText: "#fff",
    },
    secondary: {
      main: "rgb(27, 32, 49)",
      contrastText: "#fff",
    },
    tertiary: {
      main: "rgba(82, 166, 248, 0.2)",
      contrastText: "#52A6F8",
    },
    info: {
      main: "rgba(78, 148, 238, 0.2)",
      contrastText: "#4E94EE",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "50px",
          fontSize: "12px",
          textTransform: "initial",
          fontWeight: "500",
        },
        sizeLarge: {
          padding: "16px 62px",
          fontSize: "14px",
          fontWeight: "500",
        },
      },
    },
  },
});

export interface StyledButtonProps {
  className?: string;
  color?: "primary" | "secondary" | "info";
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  target?: string;
  children?: any;
  variant?: "contained" | "text";
  size?: "small" | "medium" | "large";
  endIcon?: JSX.Element;
}

export default function Button({
  className,
  color = "primary",
  children,
  disabled,
  onClick,
  href,
  variant = "contained",
  size = "medium",
  endIcon,
}: ButtonProps) {
  return (
    <ThemeProvider theme={theme}>
      <MuiButton
        disabled={disabled}
        onClick={onClick}
        href={href}
        className={className}
        color={color}
        variant={variant}
        disableElevation
        size={size}
        endIcon={endIcon}
      >
        {children}
      </MuiButton>
    </ThemeProvider>
  );
}
