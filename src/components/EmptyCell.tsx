import React from "react";

import { Cell, CellProps } from "./Cell";

export const EmptyCell: React.FC<CellProps> = ({ ...cellProps }) => {
  return <Cell {...cellProps} />;
};
