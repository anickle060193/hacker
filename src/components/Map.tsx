import React from "react";

import { useRandomInterval } from "../hooks/useRandomInterval";

const WorldSvg = React.lazy(() => import("../assets/world.svg?react"));

export const Map: React.FC = () => {
  const [coord, setCoord] = React.useState({ x: 0.5, y: 0.5 });

  useRandomInterval(true, 500, 4000, () => {
    setCoord({ x: Math.random(), y: Math.random() });
  });

  return (
    <div
      css={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <React.Suspense>
        <WorldSvg
          css={{
            width: "100%",
            height: "100%",
            fill: "transparent",
            stroke: "var( --primary-color )",
            strokeWidth: 1,
            "& > path:hover": {
              fill: `hsl(from var( --primary-color ) h s l / 0.5)`,
            },
          }}
        />
      </React.Suspense>
      <div
        css={{
          position: "absolute",
          height: 0,
          left: 0,
          right: 0,
          borderTop: "1px solid var( --primary-color )",
          transition: "top 1s ease-in-out",
          transform: "translateY( -50% )",
        }}
        style={{
          top: `${(100 * coord.y).toFixed(2)}%`,
        }}
      />
      <div
        css={{
          position: "absolute",
          width: 0,
          top: 0,
          bottom: 0,
          borderLeft: "1px solid var( --primary-color )",
          transition: "left 1s ease-in-out",
          transform: "translateX( -50% )",
        }}
        style={{
          left: `${(100 * coord.x).toFixed(2)}%`,
        }}
      />
      <div
        css={{
          position: "absolute",
          width: 16,
          height: 16,
          transition: "top 1s ease-in-out, left 1s ease-in-out",
          border: "1px solid var( --primary-color )",
          transform: "translate( -50%, -50% )",
        }}
        style={{
          top: `${(100 * coord.y).toFixed(2)}%`,
          left: `${(100 * coord.x).toFixed(2)}%`,
        }}
      />
    </div>
  );
};
