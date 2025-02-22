import React from "react";

import { Skeleton } from "../../Skeleton";

const WireFrameInner = React.lazy(() => import("./WireFrameInner"));

export const WireFrame: React.FC = () => {
  return (
    <React.Suspense fallback={<Skeleton />}>
      <WireFrameInner />
    </React.Suspense>
  );
};
