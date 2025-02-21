import React from "react";
import type { LogProps } from "./LogInner";

export type { LogProps };

const LogInner = React.lazy(() => import("./LogInner"));

export const Log: React.FC<LogProps> = () => {
  return (
    <React.Suspense>
      <LogInner />
    </React.Suspense>
  );
};
