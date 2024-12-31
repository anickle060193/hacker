import React from "react";

import { Cell, CellProps } from "./Cell";

import { useRandomInterval } from "../hooks/useRandomInterval";

import { randomBetween } from "../utils/random";
import { assertNever } from "../utils";

interface Props extends CellProps {
  count?: number;
  variant?: "bar" | "pointy";
  algorithm?: "random" | "smooth" | "sin";
}

const ALGORITHMS: Record<
  NonNullable<Props["algorithm"]>,
  (count: number) => number[]
> = {
  smooth: (count) => {
    const SPREAD = 0.3;

    const heights = Array.from({ length: count }, () => 0);

    heights[0] = Math.random();
    heights[heights.length - 1] = Math.random();

    const toProcess: [number, number][] = [[0, heights.length - 1]];

    while (toProcess.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const [i, j] = toProcess.pop()!;

      const k = Math.floor((i + j) / 2);
      if (i < k && k < j) {
        const middle =
          randomBetween(heights[i], heights[j]) +
          Math.random() * SPREAD -
          SPREAD / 2;
        heights[k] = Math.max(Math.min(middle, 1.0), 0.0);

        if (i < k - 1) {
          toProcess.push([i, k]);
        }

        if (k + 1 < j) {
          toProcess.push([k, j]);
        }
      }
    }

    return heights;
  },
  random: (count) => {
    return Array.from({ length: count }, () => Math.random());
  },
  sin: (count) => {
    const start = Math.PI * Math.random();
    const range = Math.PI * 2.8;

    return Array.from(
      { length: count },
      (_, i) => Math.cos(start + (range / count) * i) / 2 + 0.5
    );
  },
};

export const Graph: React.FC<Props> = ({
  count = 32,
  variant = "bar",
  algorithm = "random",
  ...cellProps
}) => {
  const [heights, setHeights] = React.useState<number[]>(() =>
    ALGORITHMS[algorithm](count)
  );

  useRandomInterval(true, 500, 4000, () => {
    setHeights(ALGORITHMS[algorithm](count));
  });

  let content: React.JSX.Element;
  if (variant === "bar") {
    content = (
      <div
        css={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          gap: 4,
          alignItems: "flex-end",
        }}
      >
        {heights.map((height, i) => (
          <div
            key={i}
            css={(theme) => ({
              flex: 1,
              backgroundColor: theme.colors.primary,
              transition: "height 2s ease-in-out",
            })}
            style={{
              height: `${(100 * height).toFixed(2)}%`,
            }}
          />
        ))}
      </div>
    );
  } else if (variant === "pointy") {
    const path = heights
      .map(
        (h, i) =>
          (i === 0 ? "M" : "L") +
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          `${(i / (heights.length - 1)) * 100},${h * 100}`
      )
      .join(" ");
    content = (
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        css={(theme) => ({
          width: "100%",
          height: "100%",
          strokeWidth: 0.5,
          stroke: theme.colors.primary,
        })}
      >
        <path
          css={{
            transition: "2s ease-in-out",
          }}
          style={
            {
              d: `path( "${path}" )`,
            } as React.CSSProperties
          }
        />
      </svg>
    );
  } else {
    assertNever(variant);
  }

  return <Cell {...cellProps}>{content}</Cell>;
};
