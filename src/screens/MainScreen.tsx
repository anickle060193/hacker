import React from "react";
import { Global } from "@emotion/react";
import styled from "@emotion/styled";
import { Link } from "react-router";
import { v4 as uuidv4 } from "uuid";

import {
  DialogWindow,
  DialogWindowPosition,
  DialogWindowSize,
} from "../components/DialogWindow";
import { AudioAnalyzer } from "../components/apps/AudioAnalyzer";
import { Cameras } from "../components/apps/Cameras";
import { Coder } from "../components/apps/Coder";
import { Log, LogProps } from "../components/apps/Log";
import { Graph, GraphProps } from "../components/apps/Graph";
import { Map } from "../components/apps/Map";
import { Radar } from "../components/apps/Radar";
import { WireFrame } from "../components/apps/WireFrame";
import { Console } from "../components/apps/Console";

import { assertNever, keysToArray, sleep } from "../utils";
import { randomBetween, randomChoice } from "../utils/random";

import MicrophoneIcon from "../assets/microphone.svg?react";
import CameraIcon from "../assets/security-camera.svg?react";
import CodeIcon from "../assets/code.svg?react";
import LogIcon from "../assets/log.svg?react";
import MapIcon from "../assets/map.svg?react";
import RadarIcon from "../assets/radar.svg?react";
import WireFrameIcon from "../assets/wireframe.svg?react";
import GraphIcon from "../assets/graph.svg?react";
import DashboardIcon from "../assets/dashboard.svg?react";
import WindowsIcon from "../assets/windows.svg?react";
import ConsoleIcon from "../assets/console.svg?react";

const AppIcon = styled("div")({
  width: "3rem",
  height: "3rem",
  border: "2px solid var( --primary-color )",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  "& svg": {
    fill: "var( --primary-color )",
    width: "100%",
    height: "100%",
    margin: 4,
  },
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
  log: LogProps;
  graph: GraphProps;
  map: Record<string, never>;
  radar: Record<string, never>;
  wireFrame: Record<string, never>;
  console: Record<string, never>;
}

type AppType = keyof AppPropsMapping;

type BaseApp = {
  [K in AppType]: {
    type: K;
    props: AppPropsMapping[K];
  };
}[AppType];

interface AppWindowParams {
  id: string;
  zIndex: number;
  position: DialogWindowPosition;
  size: DialogWindowSize;
}

type App = AppWindowParams & BaseApp;

const INITIAL_WINDOW_STARTING_POSITION: DialogWindowPosition = { x: 40, y: 20 };
const INITIAL_WINDOW_SIZE: DialogWindowSize = { width: 400, height: 300 };

const APP_TYPES = keysToArray<AppType>({
  audioAnalyzer: false,
  cameras: false,
  coder: false,
  log: false,
  graph: false,
  map: false,
  radar: false,
  wireFrame: false,
  console: false,
});

const LOG_SPEEDS = keysToArray<NonNullable<LogProps["speed"]>>({
  fast: false,
  normal: false,
});

const LOG_VARIANTS = keysToArray<NonNullable<LogProps["variant"]>>({
  data: false,
  chat: false,
});

const GRAPH_ALGORITHMS = keysToArray<NonNullable<GraphProps["algorithm"]>>({
  random: false,
  smooth: false,
  sine: false,
});

const GRAPH_VARIANTS = keysToArray<NonNullable<GraphProps["variant"]>>({
  bar: false,
  pointy: false,
});

function generateApp(appType: AppType): BaseApp {
  if (appType === "audioAnalyzer") {
    return {
      type: appType,
      props: {},
    };
  } else if (appType === "cameras") {
    return {
      type: appType,
      props: {},
    };
  } else if (appType === "coder") {
    return {
      type: appType,
      props: {},
    };
  } else if (appType === "log") {
    return {
      type: appType,
      props: {
        speed: randomChoice(LOG_SPEEDS),
        variant: randomChoice(LOG_VARIANTS),
      },
    };
  } else if (appType === "graph") {
    return {
      type: appType,
      props: {
        algorithm: randomChoice(GRAPH_ALGORITHMS),
        count: randomBetween(32, 128),
        variant: randomChoice(GRAPH_VARIANTS),
      },
    };
  } else if (appType === "map") {
    return {
      type: appType,
      props: {},
    };
  } else if (appType === "radar") {
    return {
      type: appType,
      props: {},
    };
  } else if (appType === "wireFrame") {
    return {
      type: appType,
      props: {},
    };
  } else if (appType === "console") {
    return {
      type: appType,
      props: {},
    };
  } else {
    assertNever(appType);
  }
}

export const MainScreen: React.FC = () => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const nextInitialPositionRef = React.useRef(INITIAL_WINDOW_STARTING_POSITION);

  const [apps, setApps] = React.useState<App[]>([]);

  React.useEffect(() => {
    if (apps.length === 0) {
      nextInitialPositionRef.current = INITIAL_WINDOW_STARTING_POSITION;
    }
  }, [apps.length]);

  function addApp(baseApp: BaseApp) {
    const { x, y } = nextInitialPositionRef.current;

    setApps((oldApps) => [
      ...oldApps,
      {
        id: uuidv4(),
        zIndex: Math.max(-1, ...oldApps.map((a) => a.zIndex)) + 1,
        position: { x, y },
        size: INITIAL_WINDOW_SIZE,
        ...baseApp,
      },
    ]);

    let nextX = x;
    let nextY = y;

    nextX += 40;
    nextY += 40;

    if (containerRef.current) {
      if (nextY >= containerRef.current.clientHeight * 0.5) {
        nextY = INITIAL_WINDOW_STARTING_POSITION.y;
      }
    }

    nextInitialPositionRef.current = { x: nextX, y: nextY };
  }

  const updateApp = React.useCallback(
    (
      windowId: string,
      callback: (oldParams: AppWindowParams) => Partial<AppWindowParams>
    ) => {
      setApps((oldApps) => {
        const newApps = [...oldApps];
        const index = newApps.findIndex((a) => a.id === windowId);
        if (index >= 0) {
          newApps[index] = {
            ...newApps[index],
            ...callback(newApps[index]),
          };
        }
        return newApps;
      });
    },
    []
  );

  const onWindowClose = React.useCallback((windowId: string) => {
    setApps((oldApps) => oldApps.filter((a) => a.id !== windowId));
  }, []);

  const onWindowFocus = React.useCallback((windowId: string) => {
    setApps((oldApps) => {
      const newApps = [...oldApps];

      const index = newApps.findIndex((a) => a.id === windowId);
      if (index >= 0) {
        newApps[index] = {
          ...newApps[index],
          zIndex:
            Math.max(
              -1,
              ...newApps.filter((a) => a.id !== windowId).map((a) => a.zIndex)
            ) + 1,
        };
      }

      return newApps;
    });
  }, []);

  const onWindowDrag = React.useCallback(
    (windowId: string, positionDiff: DialogWindowPosition) => {
      updateApp(windowId, (p) => ({
        position: {
          x: p.position.x + positionDiff.x,
          y: p.position.y + positionDiff.y,
        },
      }));
    },
    [updateApp]
  );

  const onWindowResize = React.useCallback(
    (windowId: string, sizeDiff: DialogWindowSize) => {
      updateApp(windowId, (p) => ({
        size: {
          width: p.size.width + sizeDiff.width,
          height: p.size.height + sizeDiff.height,
        },
      }));
    },
    [updateApp]
  );

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
          <AppIcon onClick={() => addApp(generateApp("graph"))}>
            <GraphIcon />
          </AppIcon>
          <AppIcon onClick={() => addApp(generateApp("audioAnalyzer"))}>
            <MicrophoneIcon />
          </AppIcon>
          <AppIcon onClick={() => addApp(generateApp("cameras"))}>
            <CameraIcon />
          </AppIcon>
          <AppIcon onClick={() => addApp(generateApp("coder"))}>
            <CodeIcon />
          </AppIcon>
          <AppIcon onClick={() => addApp(generateApp("log"))}>
            <LogIcon />
          </AppIcon>
          <AppIcon onClick={() => addApp(generateApp("map"))}>
            <MapIcon />
          </AppIcon>
          <AppIcon onClick={() => addApp(generateApp("radar"))}>
            <RadarIcon />
          </AppIcon>
          <AppIcon onClick={() => addApp(generateApp("wireFrame"))}>
            <WireFrameIcon />
          </AppIcon>
          <AppIcon onClick={() => addApp(generateApp("console"))}>
            <ConsoleIcon />
          </AppIcon>
          <div css={{ flex: 1 }} />
          <AppIcon
            onClick={async () => {
              for (let i = 0; i < 10; i++) {
                const appType = randomChoice(APP_TYPES);
                const app = generateApp(appType);
                addApp(app);

                await sleep(200);
              }
            }}
          >
            <WindowsIcon />
          </AppIcon>
          <Link
            to="/dashboard"
            css={{
              display: "block",
            }}
          >
            <AppIcon>
              <DashboardIcon />
            </AppIcon>
          </Link>
        </div>
        <div
          css={{
            flex: 1,
            position: "relative",
            overflow: "clip",
          }}
        >
          {apps.map((a) => {
            let content: NonNullable<React.ReactNode>;
            if (a.type === "audioAnalyzer") {
              content = <AudioAnalyzer />;
            } else if (a.type === "cameras") {
              content = <Cameras />;
            } else if (a.type === "coder") {
              content = <Coder />;
            } else if (a.type === "log") {
              content = <Log {...a.props} />;
            } else if (a.type === "graph") {
              content = <Graph {...a.props} />;
            } else if (a.type === "map") {
              content = <Map {...a.props} />;
            } else if (a.type === "radar") {
              content = <Radar />;
            } else if (a.type === "wireFrame") {
              content = <WireFrame />;
            } else if (a.type === "console") {
              content = <Console />;
            } else {
              assertNever(a);
            }

            return (
              <DialogWindow
                key={a.id}
                windowId={a.id}
                open={true}
                size={a.size}
                position={a.position}
                zIndex={a.zIndex}
                onClose={onWindowClose}
                onWindowFocus={onWindowFocus}
                onWindowDrag={onWindowDrag}
                onWindowResize={onWindowResize}
              >
                {content}
              </DialogWindow>
            );
          })}
        </div>
      </div>
    </>
  );
};
