import React from "react";

const CamerasInner = React.lazy(() => import("./CamerasInner"));

export const Cameras: React.FC = () => {
  return (
    <React.Suspense>
      <CamerasInner />
    </React.Suspense>
  );
};
