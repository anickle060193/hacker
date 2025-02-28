import React from "react";

import { useRandomInterval } from "../../hooks/useRandomInterval";

import { randomBetween } from "../../utils/random";
import { assertNever } from "../../utils";

export interface GraphProps {
  count?: number;
  variant?: "bar" | "line";
  algorithm?: "random" | "smooth" | "sine";
}

const ALGORITHMS: Record<
  NonNullable<GraphProps["algorithm"]>,
  (count: number) => number[]
> = {
  smooth: (count) => {
    const INITIAL_SPREAD = 1.5;

    const heights = Array.from({ length: count }, () => 0);

    heights[0] = Math.random();
    heights[heights.length - 1] = Math.random();

    const toProcess: [number, number, number][] = [
      [0, heights.length - 1, INITIAL_SPREAD],
    ];

    while (toProcess.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const [i, j, spread] = toProcess.pop()!;

      const k = Math.floor((i + j) / 2);
      if (i < k && k < j) {
        const middle =
          randomBetween(heights[i], heights[j]) +
          Math.random() * spread -
          spread / 2;
        heights[k] = Math.max(Math.min(middle, 1.0), 0.0);

        if (i < k - 1) {
          toProcess.push([i, k, spread / 2]);
        }

        if (k + 1 < j) {
          toProcess.push([k, j, spread / 2]);
        }
      }
    }

    return heights;
  },
  random: (count) => {
    return Array.from({ length: count }, () => Math.random());
  },
  sine: (count) => {
    const start = Math.PI * Math.random();
    const range = Math.PI * 2.8;

    return Array.from(
      { length: count },
      (_, i) => Math.cos(start + (range / count) * i) / 2 + 0.5
    );
  },
};

export const Graph: React.FC<GraphProps> = ({
  count = 32,
  variant = "bar",
  algorithm = "random",
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
            css={{
              flex: 1,
              backgroundColor: "var( --primary-color )",
              transition: "height 2s ease-in-out",
              minWidth: 1,
            }}
            style={{
              height: `${(100 * height).toFixed(2)}%`,
            }}
          />
        ))}
      </div>
    );
  } else if (variant === "line") {
    const path = heights
      .map(
        (h, i) =>
          (i === 0 ? "M" : "L") +
          `${((i / (heights.length - 1)) * 100).toFixed(2)},${(h * 100).toFixed(
            2
          )}`
      )
      .join(" ");
    content = (
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        css={{
          width: "100%",
          height: "100%",
          strokeWidth: 0.5,
          stroke: "var( --primary-color )",
        }}
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

  return (
    <div css={{ width: "100%", height: "100%", overflow: "hidden" }}>
      {content}
    </div>
  );
};
