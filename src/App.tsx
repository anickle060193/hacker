import React from "react";
import { HashRouter, Route, Routes } from "react-router";

import { WindowsScreen } from "./screens/WindowsScreen";
import { DashboardScreen } from "./screens/DashboardScreen";

export const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route index element={<WindowsScreen />} />
        <Route path="/dashboard" element={<DashboardScreen />} />
      </Routes>
    </HashRouter>
  );
};
