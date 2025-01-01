import React from "react";

import { Graph } from "../components/Graph";
import { Console } from "../components/Console";
import { Coder } from "../components/Coder";
import { Map } from "../components/Map";
import { WireFrame } from "../components/WireFrame";
import { AudioAnalyzer } from "../components/AudioAnalyzer";
import { EmptyCell } from "../components/EmptyCell";

const BASIC = true;

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
      <Map />
      <AudioAnalyzer />

      <Graph variant="bar" algorithm="sin" />
      {BASIC ? <EmptyCell /> : <Console source="wikimedia" />}

      <Graph variant="pointy" algorithm="sin" count={128} />

      {BASIC ? <EmptyCell /> : <Console source="blockchain" />}
      <Graph variant="pointy" algorithm="smooth" />
      <Graph variant="bar" algorithm="random" />

      <Graph variant="pointy" algorithm="random" />
      <Graph variant="bar" algorithm="smooth" />

      <Coder css={{ gridColumn: "span 2" }} />
    </div>
  );
};
