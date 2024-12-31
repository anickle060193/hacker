import React from "react";

interface Props {
  children?: React.ReactNode;
}

export const Cell: React.FC<Props> = ({ children }) => {
  return (
    <div
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
