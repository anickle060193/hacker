import React from "react";

import { Skeleton } from "../../Skeleton";

import type { LogProps } from "./LogInner";

export type { LogProps };

const LogInner = React.lazy(() => import("./LogInner"));

export const Log: React.FC<LogProps> = (props) => {
  return (
    <React.Suspense fallback={<Skeleton />}>
      <LogInner {...props} />
    </React.Suspense>
  );
};
