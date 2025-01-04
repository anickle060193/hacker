import React from "react";

export interface CellProps {
  className?: string;
}

interface Props extends CellProps {
  children?: React.ReactNode;
}

export const Cell: React.FC<Props> = ({ className, children }) => {
  return (
    <div
      className={className}
      css={{
        border: "3px solid var( --primary-color )",
        padding: 4,
      }}
    >
      {children}
    </div>
  );
};
