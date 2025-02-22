import React from "react";

import code from "../../assets/file.c?raw";

export const Coder: React.FC = () => {
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
    <textarea
      ref={setTextareaRef}
      css={{
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
        color: "var( --primary-color )",
      }}
      spellCheck={false}
      value={code.slice(0, character)}
      onChange={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.code === "Backspace") {
          setCharacter((c) => c - 1);
        } else if (/^[a-zA-Z ]$/.test(e.key)) {
          setCharacter((c) => c + Math.floor(Math.random() * 5) + 5);
        } else if (e.key === "Enter") {
          const nextNewLine = code.slice(character).indexOf("\n");
          if (nextNewLine > 0) {
            setCharacter(character + nextNewLine + 1);
          }
        }
      }}
    />
  );
};
