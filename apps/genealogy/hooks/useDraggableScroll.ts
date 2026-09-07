import React, { useRef, useEffect } from "react";

/** Mouse drag uses one scroll write per frame; touch keeps native inertial scrolling. */
export const useDraggableScroll = () => {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{
    x: number;
    y: number;
    left: number;
    top: number;
    nextX: number;
    nextY: number;
  } | null>(null);
  const frame = useRef(0);
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!drag.current) return;
      drag.current.nextX = e.clientX;
      drag.current.nextY = e.clientY;
      if (!frame.current)
        frame.current = requestAnimationFrame(() => {
          frame.current = 0;
          const d = drag.current,
            el = ref.current;
          if (d && el) {
            el.scrollLeft = d.left + d.x - d.nextX;
            el.scrollTop = d.top + d.y - d.nextY;
          }
        });
    };
    const end = () => {
      drag.current = null;
      if (ref.current) ref.current.style.cursor = "";
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", end);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", end);
      cancelAnimationFrame(frame.current);
    };
  }, []);
  return {
    ref,
    cursorClass: "cursor-grab",
    events: {
      onMouseDown: (e: React.MouseEvent) => {
        if (
          e.button !== 0 ||
          (e.target as HTMLElement).closest("button,a,input,textarea,select") ||
          !ref.current
        )
          return;
        e.preventDefault();
        const el = ref.current;
        drag.current = {
          x: e.clientX,
          y: e.clientY,
          left: el.scrollLeft,
          top: el.scrollTop,
          nextX: e.clientX,
          nextY: e.clientY,
        };
        el.style.cursor = "grabbing";
      },
    },
  };
};
