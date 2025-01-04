import React from "react";
import { createPortal } from "react-dom";

interface Position {
  x: number;
  y: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export const DialogWindow: React.FC<Props> = ({ open, onClose, children }) => {
  const [dragOffset, setDragOffset] = React.useState<Position | null>(null);
  const [resizing, setResizing] = React.useState(false);

  const [position, setPosition] = React.useState<Position>({ x: 100, y: 100 });
  const [size, setSize] = React.useState<Position>({
    x: 500,
    y: 600,
  });

  React.useEffect(() => {
    if (!(dragOffset || resizing)) {
      return;
    }

    function onMouseMove(e: MouseEvent) {
      if (dragOffset) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      } else if (resizing) {
        setSize((s) => ({
          x: s.x + e.movementX,
          y: s.y + e.movementY,
        }));
      }
    }

    function onMouseUp() {
      setDragOffset(null);
      setResizing(false);
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragOffset, resizing]);

  if (!open) {
    return null;
  }

  return createPortal(
    <div
      css={{
        position: "absolute",
        top: 0,
        left: 0,
        border: "1px solid var( --primary-color )",
        backgroundColor: "var( --background-color )",
        display: "flex",
        flexDirection: "column",
      }}
      style={{
        width: Math.max(100, size.x),
        height: Math.max(100, size.y),
        transform: `translate( ${position.x.toFixed()}px, ${position.y.toFixed()}px )`,
      }}
    >
      <div
        css={{
          borderBottom: "1px solid var( --primary-color )",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: 4,
          gap: 4,
        }}
        onMouseDown={(e) => {
          if (e.target !== e.currentTarget) {
            return;
          }

          e.preventDefault();

          const box = e.currentTarget.getBoundingClientRect();
          setDragOffset({
            x: e.clientX - box.x,
            y: e.clientY - box.y,
          });
        }}
      >
        <button
          css={{
            appearance: "none",
            width: "1rem",
            height: "1rem",
            border: "1px solid var( --primary-color )",
            background: "var( --background-color )",
            stroke: "var( --primary-color )",
            padding: 0,
            "&:hover": {
              stroke: "var( --background-color )",
              background: "var( --primary-color )",
            },
            "&:active": {
              opacity: 0.5,
            },
          }}
          onClick={() => onClose()}
        >
          <svg
            viewBox="0 0 20 20"
            css={{
              width: "100%",
              height: "100%",
              strokeWidth: 2,
            }}
          >
            <path d="M4,4 L16,16 M16,4 L4,16 z" />
          </svg>
        </button>
      </div>
      <div
        css={{
          flex: 1,
        }}
      >
        {children}
      </div>
      <div
        css={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: 6,
          height: 6,
          cursor: "se-resize",
          opacity: 0,
        }}
        onMouseDown={(e) => {
          if (e.target !== e.currentTarget) {
            return;
          }

          e.preventDefault();

          setResizing(true);
        }}
      ></div>
    </div>,
    document.body
  );
};
