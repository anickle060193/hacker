import React from "react";

const WireFrameInner = React.lazy(() => import("./WireFrameInner"));

export const WireFrame: React.FC = () => {
  return (
    <React.Suspense>
      <WireFrameInner />
    </React.Suspense>
  );
};
