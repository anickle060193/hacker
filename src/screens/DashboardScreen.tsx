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
      <Graph variant="bar" algorithm="sin" />
      <Graph variant="pointy" algorithm="sin" count={128} />
      <Console source="wikimedia" />

      <Graph variant="bar" algorithm="random" />
      <Graph variant="pointy" algorithm="random" />
      <Console source="blockchain" />

      <Graph variant="bar" algorithm="smooth" />
      <Graph variant="pointy" algorithm="smooth" />
    </div>
  );
};
