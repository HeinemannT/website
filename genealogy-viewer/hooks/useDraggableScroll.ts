import React, { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Hook for "Drag to Scroll" functionality in 2D (Horizontal + Vertical).
 * Uses direct scrollLeft/scrollTop assignment with movementX/Y for robust behavior.
 */
export const useDraggableScroll = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);

    // Mouse Down
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (!ref.current) return;

        // Prevent default to avoid text selection blocks
        e.preventDefault();
        e.stopPropagation();

        setIsDragging(true);
        setStartX(e.pageX);
        setStartY(e.pageY);
    }, []);

    // Global Mouse Move
    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging || !ref.current) return;

        e.preventDefault();
        e.stopPropagation();

        let moveX = 0;
        let moveY = 0;

        if (e.movementX !== undefined && e.movementY !== undefined) {
            moveX = e.movementX;
            moveY = e.movementY;
        } else {
            // Fallback
            moveX = e.pageX - startX;
            moveY = e.pageY - startY;
            setStartX(e.pageX);
            setStartY(e.pageY);
        }

        // Physics: 
        // Mouse Move Right (moveX > 0) -> Viewport moves LEFT -> scrollLeft decreases
        // Mouse Move Down (moveY > 0) -> Viewport moves UP -> scrollTop decreases

        const speed = 1.5;

        ref.current.scrollLeft = ref.current.scrollLeft - (moveX * speed);
        ref.current.scrollTop = ref.current.scrollTop - (moveY * speed);

    }, [isDragging, startX, startY]);

    // Global Mouse Up
    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    // Attach global listeners
    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove, { passive: false });
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    return {
        ref,
        isDragging,
        events: {
            onMouseDown: handleMouseDown
        },
        cursorClass: isDragging ? 'cursor-grabbing' : 'cursor-grab'
    };
};
