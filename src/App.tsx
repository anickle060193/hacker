import React from "react";
import { Theme, ThemeProvider } from "@emotion/react";

import { DashboardScreen } from "./screens/DashboardScreen";

const theme: Theme = {
  colors: {
    primary: "var( --primary-color )",
    background: "var( --background-color )",
    error: "var( --error-color )",
  },
};

export const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <DashboardScreen />
    </ThemeProvider>
  );
};
