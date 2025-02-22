import React from "react";
import { keyframes } from "@emotion/react";

import { useRandomInterval } from "../../hooks/useRandomInterval";

const RING_RADII = [1.0, 0.75, 0.5, 0.25];

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
    opacity: 0.8,
    filter: "blur( 0 )",
  },
  "100%": {
    opacity: 0,
    filter: "blur( 5px )",
  },
});

const SWEEP_ANIMATION_DURATION = "5s";

export const Radar: React.FC = () => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const sweeperStyleRef = React.useRef<CSSStyleDeclaration | null>(null);

  const sweeperCallbackRef = React.useCallback(
    (sweeper: HTMLElement | null) => {
      if (!sweeper) {
        sweeperStyleRef.current = null;
      } else {
        const style = window.getComputedStyle(sweeper);
        sweeperStyleRef.current = style;
      }
    },
    []
  );

  const [pings, setPings] = React.useState<
    { id: string; x: number; y: number }[]
  >([]);

  useRandomInterval(true, 200, 500, () => {
    if (!containerRef.current) {
      return;
    }

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    if (!sweeperStyleRef.current) {
      return;
    }

    const transform = sweeperStyleRef.current.transform;
    const match = /^matrix\((.*), (.*), (.*), (.*), (.*), (.*)\)$/.exec(
      transform
    );
    if (!match) {
      return;
    }

    const [a, b, c, d] = match.slice(1).map((s) => +s);

    let rotation: number;
    if (a !== 0 || b !== 0) {
      const r = Math.sqrt(a * a + b * b);
      rotation = b > 0 ? Math.acos(a / r) : -Math.acos(a / r);
    } else if (c !== 0 || d !== 0) {
      const s = Math.sqrt(c * c + d * d);
      rotation = Math.PI / 2 - (d > 0 ? Math.acos(-c / s) : -Math.acos(c / s));
    } else {
      rotation = 0;
    }

    const rotationOffset = 2;
    const rot = rotation + (rotationOffset * Math.PI) / 180;
    const size = Math.min(width, height);
    const h = Math.sqrt(2 * size * size);
    const ratio = Math.random() * 0.75 + 0.25;
    const hyp = h * ratio;
    const x = hyp * Math.cos(rot) + width / 2;
    const y = hyp * Math.sin(rot) + height / 2;

    setPings((p) => [
      ...p,
      {
        x: x,
        y: y,
        id: crypto.randomUUID(),
      },
    ]);
  });

  return (
    <div
      ref={containerRef}
      css={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {RING_RADII.map((r) => (
        <div
          key={r}
          css={{
            aspectRatio: 1,
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate( -50%, -50% )",
            border: "2px solid var( --primary-color )",
            borderRadius: "50%",
            opacity: 0.5,
          }}
          style={{
            minWidth: `${(r * 100).toFixed(2)}%`,
            minHeight: `${(r * 100).toFixed(2)}%`,
          }}
        />
      ))}
      <div
        ref={sweeperCallbackRef}
        css={{
          position: "absolute",
          top: "calc( 50% - 1px )",
          left: "50%",
          width: "100%",
          height: 0,
          borderTop: "2px solid var( --primary-color )",
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
            backgroundImage: `conic-gradient(from 90deg at 50% 50%, transparent 0 330deg, hsl( from var( --primary-color ) h s l / 0.3 ) )`,
            zIndex: -1,
          },
        }}
      />
      {pings.map(({ id, x, y }) => (
        <div
          key={id}
          css={{
            position: "absolute",
            transform: "translate( -50%, -50% )",
            width: 8,
            aspectRatio: 1,
            backgroundColor: "var( --primary-color )",
            borderRadius: "50%",
            opacity: 0,
            animation: `${pingKeyFrames} ${SWEEP_ANIMATION_DURATION} linear`,
          }}
          style={{
            left: `${x.toFixed(2)}px`,
            top: `${y.toFixed(2)}px`,
          }}
          onAnimationEnd={() => {
            setPings((ps) => ps.filter((p) => p.id !== id));
          }}
        />
      ))}
    </div>
  );
};
