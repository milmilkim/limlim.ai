import React, { useEffect } from "react";
import { clsx } from "clsx";

export interface SheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  side?: "right" | "left";
  width?: number; // px
}

export function Sheet({ open, onClose, title, children, side = "right", width = 360 }: SheetProps) {
  // ESC 닫기
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      className={clsx(
        "fixed inset-0 z-[60] transition",
        open ? "pointer-events-auto" : "pointer-events-none"
      )}
      aria-hidden={!open}
    >
      {/* overlay */}
      <div
        className={clsx(
          "absolute inset-0 bg-black/50 transition-opacity z-[1]",
          open ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />
      {/* panel */}
      <div
        className={clsx(
          "absolute top-0 h-full bg-sidebar border-l shadow-xl transition-transform z-[2]",
          side === "right" ? "right-0" : "left-0 border-r",
          open
            ? "translate-x-0"
            : side === "right"
              ? "translate-x-full"
              : "-translate-x-full"
        )}
        style={{ width }}
        role="dialog"
        aria-modal
      >
        <div className="h-12 flex items-center px-4 border-b font-medium">{title}</div>
        <div className="p-4 h-[calc(100%-3rem)] overflow-auto">{children}</div>
      </div>
    </div>
  );
}

export default Sheet; 