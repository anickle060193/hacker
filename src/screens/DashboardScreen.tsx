import React from "react";

import { Cell } from "../components/Cell";
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
      <Cell>
        <WireFrame />
      </Cell>
      <Cell>
        <Map />
      </Cell>
      <Cell>
        <AudioAnalyzer />
      </Cell>

      <Cell>
        <Radar />
      </Cell>
      <Cell>
        <Graph variant="bar" algorithm="smooth" />
      </Cell>
      <Cell>
        <Graph variant="pointy" algorithm="smooth" />
      </Cell>

      <Cell>
        <Graph variant="bar" algorithm="sine" />
      </Cell>
      <Cell>
        <Console speed="fast" variant="data" />
      </Cell>
      <Cell>
        <Cameras />
      </Cell>

      <Cell>
        <Graph variant="pointy" algorithm="sine" count={128} />
      </Cell>
      <Cell>
        <Graph variant="bar" algorithm="random" />
      </Cell>
      <Cell>
        <Console speed="normal" variant="chat" />
      </Cell>

      <Cell css={{ gridColumn: "span 2" }}>
        <Coder />
      </Cell>
      <Cell>
        <Graph variant="pointy" algorithm="random" />
      </Cell>

      <DialogWindow open={windowOpen} onClose={() => setWindowOpen(false)} />
    </div>
  );
};
