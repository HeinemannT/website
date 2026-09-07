import React, { useEffect, useRef } from "react";

export function useTreeViewport(
  width: number,
  height: number,
  identity: string,
) {
  const ref = useRef<HTMLDivElement>(null),
    contentRef = useRef<HTMLDivElement>(null);
  const transform = useRef({ x: 0, y: 0, scale: 1 });
  const frame = useRef(0),
    drag = useRef<{
      id: number;
      x: number;
      y: number;
      ox: number;
      oy: number;
      moved: boolean;
    } | null>(null),
    suppress = useRef(false);
  const constrain = () => {
    const el = ref.current;
    if (!el) return;
    const t = transform.current;
    t.x = Math.max(
      Math.min(32, el.clientWidth - width * t.scale - 32),
      Math.min(el.clientWidth - 32, t.x),
    );
    t.y = Math.max(
      Math.min(32, el.clientHeight - height * t.scale - 32),
      Math.min(el.clientHeight - 32, t.y),
    );
  };
  const apply = () => {
    constrain();
    if (!frame.current)
      frame.current = requestAnimationFrame(() => {
        frame.current = 0;
        const t = transform.current;
        if (contentRef.current)
          contentRef.current.style.transform = `translate(${t.x}px,${t.y}px) scale(${t.scale})`;
      });
  };
  const fit = () => {
    const el = ref.current;
    if (!el) return;
    const scale = Math.min(
      1,
      (el.clientWidth - 40) / width,
      (el.clientHeight - 40) / height,
    );
    transform.current = {
      scale: Math.max(0.12, scale),
      x: (el.clientWidth - width * scale) / 2,
      y: Math.max(20, (el.clientHeight - height * scale) / 2),
    };
    apply();
  };
  const zoom = (factor: number) => {
    const el = ref.current;
    if (!el) return;
    const t = transform.current,
      s = Math.max(0.12, Math.min(2, t.scale * factor)),
      ratio = s / t.scale;
    t.x = el.clientWidth / 2 - (el.clientWidth / 2 - t.x) * ratio;
    t.y = el.clientHeight / 2 - (el.clientHeight / 2 - t.y) * ratio;
    t.scale = s;
    apply();
  };
  useEffect(() => {
    fit();
    const observer = new ResizeObserver(fit);
    if (ref.current) observer.observe(ref.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame.current);
      frame.current = 0;
    };
  }, [identity, width, height]);
  const end = (e: React.PointerEvent) => {
    if (drag.current?.id !== e.pointerId) return;
    suppress.current = drag.current.moved;
    drag.current = null;
    ref.current?.releasePointerCapture(e.pointerId);
  };
  return {
    ref,
    contentRef,
    fit,
    zoom,
    events: {
      onPointerDown: (e: React.PointerEvent) => {
        if (e.button !== 0) return;
        drag.current = {
          id: e.pointerId,
          x: e.clientX,
          y: e.clientY,
          ox: transform.current.x,
          oy: transform.current.y,
          moved: false,
        };
        suppress.current = false;
      },
      onPointerMove: (e: React.PointerEvent) => {
        const d = drag.current;
        if (!d || d.id !== e.pointerId) return;
        const dx = e.clientX - d.x,
          dy = e.clientY - d.y;
        if (Math.hypot(dx, dy) > 6) {
          d.moved = true;
          ref.current?.setPointerCapture(e.pointerId);
        }
        if (d.moved) {
          transform.current.x = d.ox + dx;
          transform.current.y = d.oy + dy;
          apply();
        }
      },
      onPointerUp: end,
      onPointerCancel: end,
      onClickCapture: (e: React.MouseEvent) => {
        if (suppress.current) {
          e.preventDefault();
          e.stopPropagation();
          suppress.current = false;
        }
      },
      onKeyDown: (e: React.KeyboardEvent) => {
        if ((e.target as HTMLElement).closest("button")) return;
        const t = transform.current;
        if (e.key === "+" || e.key === "=") zoom(1.25);
        else if (e.key === "-") zoom(0.8);
        else if (e.key === "Home") fit();
        else if (e.key === "ArrowLeft") t.x += 60;
        else if (e.key === "ArrowRight") t.x -= 60;
        else if (e.key === "ArrowUp") t.y += 60;
        else if (e.key === "ArrowDown") t.y -= 60;
        else return;
        e.preventDefault();
        apply();
      },
    },
  };
}
