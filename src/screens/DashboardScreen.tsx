import React from "react";

import { Graph } from "../components/Graph";
import { Console } from "../components/Console";

export const DashboardScreen: React.FC = () => {
  return (
    <div
      css={{
        width: "100%",
        height: "100%",
        display: "grid",
        padding: "1rem",
        gridTemplateColumns: "repeat(auto-fill, minmax( 300px, 1fr ) )",
        gridTemplateRows: "repeat( auto-fill, 200px )",
        gap: 10,
      }}
    >
      <Graph algorithm="sin" />
      <Graph algorithm="random" />
      <Graph algorithm="smooth" />
      <Console source="wikimedia" />
      <Console source="blockchain" />
    </div>
  );
};
