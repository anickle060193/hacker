import React from "react";

import { Cell, CellProps } from "./Cell";

import code from "../assets/file.c?raw";

export const Coder: React.FC<CellProps> = ({ ...cellProps }) => {
  const [character, setCharacter] = React.useState(
    Math.floor(Math.random() * 500 + 100)
  );
  const [textareaRef, setTextareaRef] =
    React.useState<HTMLTextAreaElement | null>(null);

  React.useEffect(() => {
    if (textareaRef) {
      textareaRef.scrollTop = textareaRef.scrollHeight;
    }
  }, [character, textareaRef]);

  return (
    <Cell {...cellProps}>
      <textarea
        ref={setTextareaRef}
        css={(theme) => ({
          width: "100%",
          height: "100%",
          fontSize: "0.5em",
          whiteSpace: "pre",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },

          resize: "none",
          border: "none",
          outline: "none",
          overflow: "auto",
          background: "transparent",
          color: theme.colors.primary,
        })}
        spellCheck={false}
        value={code.slice(0, character)}
        onChange={(e) => e.preventDefault()}
        onKeyDown={(e) => {
          e.preventDefault();
          e.stopPropagation();

          if (e.code === "Backspace") {
            setCharacter((c) => c - 1);
          } else if (/^[a-zA-Z]$/.test(e.key)) {
            setCharacter((c) => c + 10);
          } else if (e.key === "Enter") {
            const nextNewLine = code.slice(character).indexOf("\n");
            if (nextNewLine > 0) {
              setCharacter(character + nextNewLine + 1);
            }
          }
        }}
      />
    </Cell>
  );
};
