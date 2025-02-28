import React from "react";
import { Link } from "react-router";

import { Cell } from "../components/Cell";

import { Graph } from "../components/apps/Graph";
import { Log } from "../components/apps/Log";
import { Coder } from "../components/apps/Coder";
import { Map } from "../components/apps/Map";
import { WireFrame } from "../components/apps/WireFrame";
import { AudioAnalyzer } from "../components/apps/AudioAnalyzer";
import { Cameras } from "../components/apps/Cameras";
import { Radar } from "../components/apps/Radar";

import HomeIcon from "../assets/home.svg?react";

export const DashboardScreen: React.FC = () => {
  return (
    <div
      css={{
        display: "grid",
        padding: "1rem",
        gridTemplateColumns: "repeat( auto-fill, minmax( 300px, 1fr ) )",
        gridAutoRows: "250px",
        gap: "10px",
        containerType: "size",
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
        <Graph variant="line" algorithm="smooth" />
      </Cell>

      <Cell>
        <Graph variant="bar" algorithm="sine" />
      </Cell>
      <Cell>
        <Log speed="fast" variant="data" />
      </Cell>
      <Cell>
        <Cameras />
      </Cell>

      <Cell>
        <Graph variant="line" algorithm="sine" count={128} />
      </Cell>
      <Cell>
        <Graph variant="bar" algorithm="random" />
      </Cell>
      <Cell>
        <Log speed="normal" variant="chat" />
      </Cell>

      <Cell
        css={{
          "@container (min-width: 600px)": {
            gridColumn: "span 2",
          },
        }}
      >
        <Coder />
      </Cell>
      <Cell>
        <Graph variant="line" algorithm="random" />
      </Cell>

      <Cell>
        <Link
          to="/"
          css={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <HomeIcon
            css={{
              fill: "var( --primary-color )",
            }}
          />
        </Link>
      </Cell>
    </div>
  );
};
