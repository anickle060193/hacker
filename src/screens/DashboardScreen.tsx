import React from "react";

import { Graph } from "../components/Graph";
import { Console } from "../components/Console";
import { Coder } from "../components/Coder";
import { Map } from "../components/Map";
import { WireFrame } from "../components/WireFrame";
import { AudioAnalyzer } from "../components/AudioAnalyzer";
import { DialogWindow } from "../components/DialogWindow";
import { Cameras } from "../components/Cameras";
import { Radar } from "../components/Radar";

export const DashboardScreen: React.FC = () => {
  const [windowOpen, setWindowOpen] = React.useState(false);

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

      <Radar />
      <Graph variant="bar" algorithm="smooth" />
      <Graph variant="pointy" algorithm="smooth" />

      <Graph variant="bar" algorithm="sin" />
      <Console speed="fast" variant="data" />
      <Cameras />

      <Graph variant="pointy" algorithm="sin" count={128} />
      <Graph variant="bar" algorithm="random" />
      <Console speed="normal" variant="chat" />

      <Coder css={{ gridColumn: "span 2" }} />
      <Graph variant="pointy" algorithm="random" />
      <DialogWindow open={windowOpen} onClose={() => setWindowOpen(false)} />
    </div>
  );
};
