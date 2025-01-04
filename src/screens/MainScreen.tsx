import React from "react";
import { Global } from "@emotion/react";
import styled from "@emotion/styled";

import { AudioAnalyzer } from "../components/AudioAnalyzer";
import { Cameras } from "../components/Cameras";
import { Coder } from "../components/Coder";
import { Console, ConsoleProps } from "../components/Console";
import { DialogWindow } from "../components/DialogWindow";
import { Graph, GraphProps } from "../components/Graph";
import { Map } from "../components/Map";
import { Radar } from "../components/Radar";
import { WireFrame } from "../components/WireFrame";

import { assertNever } from "../utils";
import { randomBetween, randomChoice } from "../utils/random";

const AppIcon = styled("div")({
  width: "100%",
  border: "2px solid var( --primary-color )",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  aspectRatio: 1,
  cursor: "pointer",
});

const globalStyles = (
  <Global
    styles={{
      "html, body, #root": {
        width: "100%",
        height: "100%",
      },
      body: {
        overflow: "hidden",
      },
    }}
  />
);

interface AppPropsMapping {
  audioAnalyzer: object;
  cameras: object;
  coder: object;
  console: ConsoleProps;
  graph: GraphProps;
  map: object;
  radar: object;
  wireFrame: object;
}

type App = {
  id: string;
} & {
  [K in keyof AppPropsMapping]: {
    type: K;
    props: AppPropsMapping[K];
  };
}[keyof AppPropsMapping];

export const MainScreen: React.FC = () => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const [apps, setApps] = React.useState<App[]>([]);
  const [nextInitialPosition, setNextInitialPosition] = React.useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  function addApp(app: App) {
    let { x, y } = nextInitialPosition;
    if (apps.length === 0) {
      x = 80;
      y = 20;
    } else {
      x += 20;
      y += 20;

      if (containerRef.current) {
        if (y >= containerRef.current.clientHeight * 0.5) {
          y = 20;
        }
      }
    }

    setNextInitialPosition({ x, y });

    setApps([...apps, app]);
  }

  return (
    <>
      {globalStyles}
      <div
        ref={containerRef}
        css={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          border: "3px solid var( --primary-color )",
        }}
      >
        <div
          css={{
            borderRight: "3px solid var( --primary-color )",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 8,
            gap: 8,
            width: "4rem",
          }}
        >
          <AppIcon
            onClick={() =>
              addApp({
                id: crypto.randomUUID(),
                type: "graph",
                props: {
                  algorithm: randomChoice(["random", "smooth", "sine"]),
                  count: randomBetween(32, 128),
                  variant: randomChoice(["bar", "pointy"]),
                },
              })
            }
          >
            <svg
              viewBox="0 0 26 26"
              css={{
                fill: "var( --primary-color )",
              }}
            >
              <rect x="1" y="1" width="4" height="24" />
              <rect x="6" y="11" width="4" height="14" />
              <rect x="11" y="5" width="4" height="20" />
              <rect x="16" y="17" width="4" height="8" />
              <rect x="21" y="9" width="4" height="16" />
            </svg>
          </AppIcon>
          <AppIcon>G</AppIcon>
        </div>
        <div
          css={{
            flex: 1,
          }}
        ></div>
      </div>
      {apps.map((a) => {
        let content: NonNullable<React.ReactNode>;
        if (a.type === "audioAnalyzer") {
          content = <AudioAnalyzer />;
        } else if (a.type === "cameras") {
          content = <Cameras />;
        } else if (a.type === "coder") {
          content = <Coder />;
        } else if (a.type === "console") {
          content = <Console {...a.props} />;
        } else if (a.type === "graph") {
          content = <Graph {...a.props} />;
        } else if (a.type === "map") {
          content = <Map {...a.props} />;
        } else if (a.type === "radar") {
          content = <Radar />;
        } else if (a.type === "wireFrame") {
          content = <WireFrame />;
        } else {
          assertNever(a);
        }

        return (
          <DialogWindow
            key={a.id}
            open={true}
            initialPosition={nextInitialPosition}
            onClose={() =>
              setApps((apps) => apps.filter((ap) => ap.id !== a.id))
            }
          >
            {content}
          </DialogWindow>
        );
      })}
    </>
  );
};
