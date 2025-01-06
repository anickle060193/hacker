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

import MicrophoneIcon from "../assets/microphone.svg?react";
import CameraIcon from "../assets/security-camera.svg?react";
import CodeIcon from "../assets/code.svg?react";
import ConsoleIcon from "../assets/console.svg?react";
import MapIcon from "../assets/map.svg?react";
import RadarIcon from "../assets/radar.svg?react";
import WireFrameIcon from "../assets/wireframe.svg?react";
import GraphIcon from "../assets/graph.svg?react";

const AppIcon = styled("div")({
  width: "3rem",
  height: "3rem",
  border: "2px solid var( --primary-color )",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
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
  audioAnalyzer: Record<string, never>;
  cameras: Record<string, never>;
  coder: Record<string, never>;
  console: ConsoleProps;
  graph: GraphProps;
  map: Record<string, never>;
  radar: Record<string, never>;
  wireFrame: Record<string, never>;
}

type BaseApp = {
  [K in keyof AppPropsMapping]: {
    type: K;
    props: AppPropsMapping[K];
  };
}[keyof AppPropsMapping];

type App = {
  id: string;
  zIndex: number;
} & BaseApp;

export const MainScreen: React.FC = () => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const [apps, setApps] = React.useState<App[]>([]);
  const [nextInitialPosition, setNextInitialPosition] = React.useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const [nextZIndex, setNextZIndex] = React.useState(0);

  function addApp(app: BaseApp) {
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
    setNextZIndex((z) => z + 1);

    setApps([
      ...apps,
      {
        id: crypto.randomUUID(),
        zIndex: nextZIndex,
        ...app,
      },
    ]);
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
          }}
        >
          <AppIcon
            onClick={() =>
              addApp({
                type: "graph",
                props: {
                  algorithm: randomChoice(["random", "smooth", "sine"]),
                  count: randomBetween(32, 128),
                  variant: randomChoice(["bar", "pointy"]),
                },
              })
            }
          >
            <GraphIcon
              css={{
                fill: "var( --primary-color )",
                width: "100%",
                height: "100%",
                margin: 4,
              }}
            />
          </AppIcon>
          <AppIcon
            onClick={() =>
              addApp({
                type: "audioAnalyzer",
                props: {},
              })
            }
          >
            <MicrophoneIcon
              css={{
                fill: "var( --primary-color )",
                width: "100%",
                height: "100%",
                margin: 4,
              }}
            />
          </AppIcon>
          <AppIcon
            onClick={() =>
              addApp({
                type: "cameras",
                props: {},
              })
            }
          >
            <CameraIcon
              css={{
                fill: "var( --primary-color )",
                width: "100%",
                height: "100%",
                margin: 4,
              }}
            />
          </AppIcon>
          <AppIcon
            onClick={() =>
              addApp({
                type: "coder",
                props: {},
              })
            }
          >
            <CodeIcon
              css={{
                fill: "var( --primary-color )",
                width: "100%",
                height: "100%",
                margin: 4,
              }}
            />
          </AppIcon>
          <AppIcon
            onClick={() =>
              addApp({
                type: "console",
                props: {},
              })
            }
          >
            <ConsoleIcon
              css={{
                fill: "var( --primary-color )",
                width: "100%",
                height: "100%",
                margin: 4,
              }}
            />
          </AppIcon>
          <AppIcon
            onClick={() =>
              addApp({
                type: "map",
                props: {},
              })
            }
          >
            <MapIcon
              css={{
                fill: "var( --primary-color )",
                width: "100%",
                height: "100%",
                margin: 4,
              }}
            />
          </AppIcon>
          <AppIcon
            onClick={() =>
              addApp({
                type: "radar",
                props: {},
              })
            }
          >
            <RadarIcon
              css={{
                fill: "var( --primary-color )",
                width: "100%",
                height: "100%",
                margin: 4,
              }}
            />
          </AppIcon>
          <AppIcon
            onClick={() =>
              addApp({
                type: "wireFrame",
                props: {},
              })
            }
          >
            <WireFrameIcon
              css={{
                fill: "var( --primary-color )",
                width: "100%",
                height: "100%",
                margin: 4,
              }}
            />
          </AppIcon>
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
            onClose={() => {
              setApps((apps) => apps.filter((ap) => ap.id !== a.id));
            }}
            initialPosition={nextInitialPosition}
            zIndex={a.zIndex}
            onWindowFocus={() => {
              setApps((apps) =>
                apps.map((ap) =>
                  ap.id === a.id ? { ...ap, zIndex: nextZIndex } : ap
                )
              );
              setNextZIndex((z) => z + 1);
            }}
          >
            {content}
          </DialogWindow>
        );
      })}
    </>
  );
};
