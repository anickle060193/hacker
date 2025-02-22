import { keyframes } from "@emotion/react";
import React from "react";

const skeletonAnimation = keyframes({
  "0%, 100%": {
    opacity: 0.4,
  },
  "50%": {
    opacity: 1.0,
  },
});

export const Skeleton: React.FC = () => {
  return (
    <div
      css={{
        width: "100%",
        height: "100%",
        background: "rgb( from var( --primary-color ) r g b / 0.2 )",
        animationName: skeletonAnimation,
        animationDuration: "2s",
        animationDelay: "0.5s",
        animationTimingFunction: "ease-in-out",
        animationIterationCount: "infinite",
      }}
    />
  );
};
