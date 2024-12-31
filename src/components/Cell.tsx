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
      css={(theme) => ({
        borderWidth: 3,
        borderStyle: "solid",
        borderColor: theme.colors.primary,
        padding: 4,
      })}
    >
      {children}
    </div>
  );
};
