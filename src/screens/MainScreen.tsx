import React from "react";
import { Global } from "@emotion/react";
import styled from "@emotion/styled";
import { DialogWindow } from "../components/DialogWindow";
import { Graph } from "../components/Graph";

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

export const MainScreen: React.FC = () => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const [graphApps, setGraphApps] = React.useState<string[]>([]);
  const [nextInitialPosition, setNextInitialPosition] = React.useState<{
    x: number;
    y: number;
  }>({ x: 50, y: 0 });

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
            onClick={() => {
              let { x, y } = nextInitialPosition;
              x += 20;
              y += 20;

              if (containerRef.current) {
                if (y >= containerRef.current.clientHeight * 0.5) {
                  y = 20;
                }
              }

              setNextInitialPosition({ x, y });
              setGraphApps((a) => [...a, crypto.randomUUID()]);
            }}
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
      {graphApps.map((g) => (
        <DialogWindow
          key={g}
          open={true}
          initialPosition={nextInitialPosition}
          onClose={() => setGraphApps((gas) => gas.filter((ga) => ga !== g))}
        >
          <Graph />
        </DialogWindow>
      ))}
    </>
  );
};
