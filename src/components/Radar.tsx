import React from "react";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

import { Cell, CellProps } from "./Cell";

const Circle = styled("div")(({ theme }) => ({
  aspectRatio: 1,
  position: "absolute",
  left: "50%",
  top: "50%",
  transform: "translate( -50%, -50% )",
  borderWidth: 2,
  borderStyle: "solid",
  borderColor: theme.colors.primary,
  borderRadius: "50%",
  opacity: 0.5,
}));

const sweeperAnimation = keyframes({
  "0%": {
    transform: "rotate( 0turn )",
  },
  "50%": {
    transform: "rotate( 0.5turn )",
  },
  "100%": {
    transform: "rotate( 1turn )",
  },
});

const pingKeyFrames = keyframes({
  "0%": {
    opacity: 1,
    filter: "blur( 0 )",
  },
  "100%": {
    opacity: 0,
    filter: "blur( 5px )",
  },
});

const SWEEP_ANIMATION_DURATION = "10s";

const Ping = styled("div")(({ theme }) => ({
  position: "absolute",
  transform: "translate( -50%, -50% )",
  width: 8,
  aspectRatio: 1,
  backgroundColor: theme.colors.primary,
  borderRadius: "50%",
  opacity: 0,
  animation: `${pingKeyFrames} ${SWEEP_ANIMATION_DURATION} linear infinite`,
}));

export const Radar: React.FC<CellProps> = ({ ...cellProps }) => {
  const [pings] = React.useState(() =>
    Array.from({ length: 4 }, () => {
      const x = Math.random();
      const y = Math.random();

      const normX = (x - 0.5) * 2;
      const normY = (0.5 - y) * 2;
      const angle = Math.atan2(normY, normX);
      const delay = (2 * Math.PI - angle) / (2 * Math.PI);
      console.log("DELAY:", normX, normY, angle * (180 / Math.PI));

      return {
        x: `${(x * 100).toFixed(2)}%`,
        y: `${(y * 100).toFixed(2)}%`,
        delay: `calc( ${SWEEP_ANIMATION_DURATION} * ${delay.toFixed(8)} )`,
      };
    })
  );

  return (
    <Cell {...cellProps}>
      <div
        css={{
          width: "100%",
          height: "100%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Circle
          style={{
            width: "125%",
          }}
        />
        <Circle
          style={{
            width: "100%",
          }}
        />
        <Circle
          style={{
            width: "75%",
          }}
        />
        <Circle
          style={{
            width: "50%",
          }}
        />
        <Circle
          style={{
            width: "25%",
          }}
        />
        <Circle
          css={(theme) => ({
            backgroundColor: theme.colors.primary,
            opacity: 1,
          })}
          style={{
            width: 10,
          }}
        />
        <div
          css={(theme) => ({
            position: "absolute",
            top: "calc( 50% - 1px )",
            left: "50%",
            width: "100%",
            height: 0,
            borderTopWidth: 2,
            borderTopStyle: "solid",
            borderTopColor: theme.colors.primary,
            transformOrigin: "0 50%",
            animation: `${sweeperAnimation} ${SWEEP_ANIMATION_DURATION} linear infinite`,
            "&::before": {
              content: '""',
              position: "absolute",
              display: "block",
              width: "200%",
              top: 0,
              left: 0,
              transform: "translate( -50%, -50% )",
              aspectRatio: 1,
              backgroundImage: `conic-gradient(from 90deg at 50% 50%, transparent 0 330deg, hsl( from ${theme.colors.primary} h s l / 0.3 ) )`,
              zIndex: -1,
            },
          })}
        />
        {pings.map(({ x, y, delay }, i) => (
          <Ping
            key={i}
            style={{
              left: x,
              top: y,
              animationDelay: delay,
            }}
          />
        ))}
      </div>
    </Cell>
  );
};
