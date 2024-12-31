import React from "react";

import { Cell, CellProps } from "./Cell";

import WorldSvg from "../assets/world.svg?react";
import { useRandomInterval } from "../hooks/useRandomInterval";

export const Map: React.FC<CellProps> = ({ ...cellProps }) => {
  const [coord, setCoord] = React.useState({ x: 0.5, y: 0.5 });

  useRandomInterval(true, 500, 4000, () => {
    setCoord({ x: Math.random(), y: Math.random() });
  });

  return (
    <Cell
      {...cellProps}
      css={{
        position: "relative",
        overflow: "hidden",
      }}
    >
      <WorldSvg
        css={(theme) => ({
          width: "100%",
          height: "100%",
          fill: "transparent",
          stroke: theme.colors.primary,
          strokeWidth: 1,
          "& > path:hover": {
            fill: `hsl(from ${theme.colors.primary} h s l / 0.5)`,
          },
        })}
      />
      <div
        css={(theme) => ({
          position: "absolute",
          height: 0,
          left: 0,
          right: 0,
          borderTopWidth: 1,
          borderTopStyle: "solid",
          borderTopColor: theme.colors.primary,
          transition: "top 1s ease-in-out",
          transform: "translateY( -50% )",
        })}
        style={{
          top: `${(100 * coord.y).toFixed(2)}%`,
        }}
      />
      <div
        css={(theme) => ({
          position: "absolute",
          width: 0,
          top: 0,
          bottom: 0,
          borderLeftWidth: 1,
          borderLeftStyle: "solid",
          borderLeftColor: theme.colors.primary,
          transition: "left 1s ease-in-out",
          transform: "translateX( -50% )",
        })}
        style={{
          left: `${(100 * coord.x).toFixed(2)}%`,
        }}
      />
      <div
        css={(theme) => ({
          position: "absolute",
          width: 16,
          height: 16,
          transition: "top 1s ease-in-out, left 1s ease-in-out",
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: theme.colors.primary,
          transform: "translate( -50%, -50% )",
        })}
        style={{
          top: `${(100 * coord.y).toFixed(2)}%`,
          left: `${(100 * coord.x).toFixed(2)}%`,
        }}
      />
    </Cell>
  );
};
