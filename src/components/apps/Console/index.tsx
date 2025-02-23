import React from "react";

import { Skeleton } from "../../Skeleton";

const ConsoleInner = React.lazy(() => import("./ConsoleInner"));

export const Console: React.FC = () => {
  return (
    <React.Suspense fallback={<Skeleton />}>
      <ConsoleInner />
    </React.Suspense>
  );
};
