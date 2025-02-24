import React from "react";

export interface DialogWindowPosition {
  readonly x: number;
  readonly y: number;
}

export interface DialogWindowSize {
  readonly width: number;
  readonly height: number;
}

interface Props {
  windowId: string;
  open: boolean;
  zIndex: number;
  size: DialogWindowSize;
  position: DialogWindowPosition;
  onClose: (windowId: string) => void;
  onWindowFocus: (windowId: string) => void;
  onWindowDrag: (windowId: string, diff: DialogWindowPosition) => void;
  onWindowResize: (windowId: string, diff: DialogWindowSize) => void;
  children?: React.ReactNode;
}

export const DialogWindow: React.FC<Props> = ({
  windowId,
  open,
  zIndex,
  size,
  position,
  onClose,
  onWindowFocus,
  onWindowDrag,
  onWindowResize,
  children,
}) => {
  const [dragging, setDragging] = React.useState(false);
  const [resizing, setResizing] = React.useState(false);

  if (!open) {
    return null;
  }

  return (
    <div
      css={{
        position: "absolute",
        top: 0,
        left: 0,
        border: "1px solid var( --primary-color )",
        outline: "3px solid black",
        backgroundColor: "var( --background-color )",
        display: "flex",
        flexDirection: "column",
      }}
      style={{
        width: Math.max(100, size.width),
        height: Math.max(100, size.height),
        transform: `translate( ${position.x.toFixed()}px, ${position.y.toFixed()}px )`,
        zIndex: zIndex,
      }}
      onPointerDownCapture={() => {
        onWindowFocus(windowId);
      }}
    >
      <div
        css={{
          borderBottom: "1px solid var( --primary-color )",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          padding: 4,
          gap: 4,
        }}
        onPointerDown={(e) => {
          if (e.target !== e.currentTarget || e.button !== 0) {
            return;
          }

          e.currentTarget.setPointerCapture(e.pointerId);

          setDragging(true);
        }}
        {...(dragging
          ? {
              onPointerUp: () => {
                setDragging(false);
              },
              onPointerMove: (e) => {
                if (dragging) {
                  onWindowDrag(windowId, {
                    x: e.movementX,
                    y: e.movementY,
                  });
                }
              },
            }
          : {})}
        onAuxClick={(e) => {
          if (e.button !== 1) {
            return;
          }

          onClose(windowId);
        }}
      >
        <div css={{ flex: 1 }} />
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
          onClick={() => onClose(windowId)}
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
          overflow: "hidden",
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
        onPointerDown={(e) => {
          if (e.target !== e.currentTarget) {
            return;
          }

          e.currentTarget.setPointerCapture(e.pointerId);

          setResizing(true);
        }}
        {...(resizing
          ? {
              onPointerUp: () => {
                setResizing(false);
              },
              onPointerMove: (e) => {
                if (resizing) {
                  onWindowResize(windowId, {
                    width: e.movementX,
                    height: e.movementY,
                  });
                }
              },
            }
          : {})}
      />
    </div>
  );
};
