import React from "react";
import { HashRouter, Route, Routes } from "react-router";

import { MainScreen } from "./screens/MainScreen";
import { DashboardScreen } from "./screens/DashboardScreen";

export const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route index element={<MainScreen />} />
        <Route path="/dashboard" element={<DashboardScreen />} />
      </Routes>
    </HashRouter>
  );
};
