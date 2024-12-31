import React from "react";

interface Props {
  smooth?: boolean;
}

export const Graph: React.FC<Props> = ({ smooth = true }) => {
  return <div>{smooth}</div>;
};
