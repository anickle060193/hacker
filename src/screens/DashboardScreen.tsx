import React from "react";

import { Graph } from "../components/Graph";
import { Console } from "../components/Console";
import { Coder } from "../components/Coder";
import { Map } from "../components/Map";
import { WireFrame } from "../components/WireFrame";
import { AudioAnalyzer } from "../components/AudioAnalyzer";
import { DialogWindow } from "../components/DialogWindow";
import { Cameras } from "../components/Cameras";

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

      <Graph variant="bar" algorithm="sin" />
      <Console speed="fast" variant="data" />
      <Cameras />

      <Graph variant="pointy" algorithm="sin" count={128} />

      <Graph variant="bar" algorithm="smooth" />
      <Console speed="normal" variant="chat" />
      <Graph variant="bar" algorithm="random" />

      <Graph variant="pointy" algorithm="random" />
      <Graph variant="pointy" algorithm="smooth" />

      <Coder css={{ gridColumn: "span 2" }} />

      <DialogWindow open={windowOpen} onClose={() => setWindowOpen(false)} />
    </div>
  );
};
