import React from "react";
import type { ConsoleProps } from "./ConsoleInner";

export type { ConsoleProps };

const ConsoleInner = React.lazy(() => import("./ConsoleInner"));

export const Console: React.FC<ConsoleProps> = () => {
  return (
    <React.Suspense>
      <ConsoleInner />
    </React.Suspense>
  );
};
