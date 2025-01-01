import React from "react";

import { Graph } from "../components/Graph";
import { Console } from "../components/Console";
import { Coder } from "../components/Coder";
import { Map } from "../components/Map";
import { WireFrame } from "../components/WireFrame";

export const DashboardScreen: React.FC = () => {
  return (
    <div
      css={{
        display: "grid",
        padding: "1rem",
        gridTemplateColumns: "repeat(auto-fill, minmax( 300px, 1fr ) )",
        gridAutoRows: "200px",
        gap: 10,
      }}
    >
      <WireFrame />

      <Graph variant="bar" algorithm="sin" />
      <Graph variant="pointy" algorithm="sin" count={128} />
      <Console source="wikimedia" />

      <Graph variant="bar" algorithm="random" />
      <Graph variant="pointy" algorithm="random" />
      <Console source="blockchain" />

      <Graph variant="bar" algorithm="smooth" />
      <Graph variant="pointy" algorithm="smooth" />

      <Map />

      <Coder css={{ gridColumn: "span 2" }} />
    </div>
  );
};
