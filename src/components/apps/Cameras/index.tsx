import React from "react";

import { Skeleton } from "../../Skeleton";

const CamerasInner = React.lazy(() => import("./CamerasInner"));

export const Cameras: React.FC = () => {
  return (
    <React.Suspense fallback={<Skeleton />}>
      <CamerasInner />
    </React.Suspense>
  );
};
