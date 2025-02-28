import React from "react";
import { createPortal } from "react-dom";

export interface ContextMenuItemProps {
  label: string;
  onClick: () => void;
}

export const ContextMenuItem: React.FC<ContextMenuItemProps> = ({
  label,
  onClick,
}) => {
  return (
    <div
      css={{
        padding: "2px 4px",
        userSelect: "none",
      }}
      onClick={onClick}
    >
      {label}
    </div>
  );
};

export type ContextMenuItem = React.ReactElement<
  ContextMenuProps,
  typeof ContextMenuItem
>;

export interface ContextMenuPosition {
  left: number;
  top: number;
}

interface ContextMenuProps {
  position: ContextMenuPosition;
  onClose: () => void;
  children: ContextMenuItem | ContextMenuItem[];
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  position,
  onClose,
  children,
}) => {
  const onCloseRef = React.useRef(onClose);

  React.useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  React.useEffect(() => {
    function onPointerDown() {
      onCloseRef.current();
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onCloseRef.current();
      }
    }

    document.addEventListener("pointerdown", onPointerDown, { passive: true });
    document.addEventListener("keydown", onKeyDown, { passive: true });

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return createPortal(
    <div
      css={{
        position: "absolute",
        border: "2px solid var( --primary-color )",
        outline: "1px solid var( --background-color )",
        background: "var( --background-color )",
        color: "var( --primary-color )",
        minWidth: "10rem",
        "& > *:not( :last-child )": {
          borderBottom: "1px solid var( --primary-color )",
        },
      }}
      style={{
        left: position.left,
        top: position.top,
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
      }}
      onClick={() => {
        onClose();
      }}
    >
      {children}
    </div>,
    document.body
  );
};
