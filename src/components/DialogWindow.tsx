import React from "react";
import styled from "@emotion/styled";

import {
  ContextMenu,
  ContextMenuItem,
  ContextMenuPosition,
} from "./ContextMenu";

import MenuIcon from "../assets/menu.svg?react";

const DialogWindowButton = styled("button")({
  appearance: "none",
  width: "1rem",
  height: "1rem",
  border: "1px solid var( --primary-color )",
  background: "var( --background-color )",
  stroke: "var( --primary-color )",
  fill: "var( --primary-color )",
  padding: 0,
  "&:hover": {
    stroke: "var( --background-color )",
    fill: "var( --background-color )",
    background: "var( --primary-color )",
  },
  "&:active": {
    opacity: 0.5,
  },
});

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
  contextMenu: ContextMenuItem | ContextMenuItem[];
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
  contextMenu,
  onClose,
  onWindowFocus,
  onWindowDrag,
  onWindowResize,
  children,
}) => {
  const [dragging, setDragging] = React.useState(false);
  const [resizing, setResizing] = React.useState(false);

  const lastPointerScreenCoordsRef = React.useRef<DialogWindowPosition>({
    x: 0,
    y: 0,
  });

  const [windowContextMenuPosition, setWindowContextMenuPosition] =
    React.useState<ContextMenuPosition | null>(null);

  React.useEffect(() => {
    if (!(dragging || resizing)) {
      return;
    }

    function onPointeUp(e: PointerEvent) {
      if (e.target instanceof HTMLElement) {
        e.target.releasePointerCapture(e.pointerId);
      }

      setDragging(false);
      setResizing(false);

      lastPointerScreenCoordsRef.current = { x: 0, y: 0 };
    }

    function onPointerMove(e: PointerEvent) {
      const movementX = e.screenX - lastPointerScreenCoordsRef.current.x;
      const movementY = e.screenY - lastPointerScreenCoordsRef.current.y;

      if (dragging) {
        onWindowDrag(windowId, {
          x: movementX,
          y: movementY,
        });
      } else if (resizing) {
        onWindowResize(windowId, {
          width: movementX,
          height: movementY,
        });
      }

      lastPointerScreenCoordsRef.current = { x: e.screenX, y: e.screenY };
    }

    window.addEventListener("pointerup", onPointeUp);
    window.addEventListener("pointermove", onPointerMove);

    return () => {
      window.removeEventListener("pointerup", onPointeUp);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [windowId, onWindowDrag, onWindowResize, dragging, resizing]);

  if (!open) {
    return null;
  }

  return (
    <>
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
        onContextMenu={(e) => {
          e.preventDefault();

          setWindowContextMenuPosition({ left: e.clientX, top: e.clientY });
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
            touchAction: "none",
          }}
          onPointerDown={(e) => {
            if (e.target !== e.currentTarget || e.button !== 0) {
              return;
            }

            e.currentTarget.setPointerCapture(e.pointerId);
            lastPointerScreenCoordsRef.current = { x: e.screenX, y: e.screenY };
            setDragging(true);
          }}
          onAuxClick={(e) => {
            if (e.button !== 1) {
              return;
            }

            onClose(windowId);
          }}
        >
          <div css={{ flex: 1 }} />
          <DialogWindowButton
            onClick={(e) =>
              setWindowContextMenuPosition({ left: e.clientX, top: e.clientY })
            }
          >
            <MenuIcon />
          </DialogWindowButton>
          <DialogWindowButton onClick={() => onClose(windowId)}>
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
          </DialogWindowButton>
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
            touchAction: "none",
          }}
          onPointerDown={(e) => {
            if (e.target !== e.currentTarget) {
              return;
            }

            e.currentTarget.setPointerCapture(e.pointerId);
            lastPointerScreenCoordsRef.current = { x: e.screenX, y: e.screenY };
            setResizing(true);
          }}
        />
      </div>
      {windowContextMenuPosition && (
        <ContextMenu
          position={windowContextMenuPosition}
          onClose={() => setWindowContextMenuPosition(null)}
        >
          {contextMenu}
        </ContextMenu>
      )}
    </>
  );
};
