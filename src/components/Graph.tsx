import React from "react";

import { useInterval } from "../hooks/useInterval";
import { randomBetween } from "../utils/random";

interface Props {
  count?: number;
  variant?: "bar" | "smooth" | "pointy";
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
    const start = 2 * Math.PI * Math.random();
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
}) => {
  const [heights, setHeights] = React.useState<number[]>(() =>
    ALGORITHMS[algorithm](count)
  );

  useInterval(true, 2000, () => {
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
  } else {
    content = <div />;
  }

  return (
    <div
      css={(theme) => ({
        borderWidth: 3,
        borderStyle: "solid",
        borderColor: theme.colors.primary,
        padding: 4,
      })}
    >
      {content}
    </div>
  );
};
