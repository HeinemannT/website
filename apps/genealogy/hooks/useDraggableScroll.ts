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

    // --- MOUSE EVENTS ---
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (!ref.current) return;
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
        setStartX(e.pageX);
        setStartY(e.pageY);
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isDragging || !ref.current) return;
        e.preventDefault();
        e.stopPropagation();

        // Calculate delta
        const x = e.pageX;
        const y = e.pageY;
        const walkX = (x - startX) * 1.5; // Scroll-fast
        const walkY = (y - startY) * 1.5;

        ref.current.scrollLeft = ref.current.scrollLeft - walkX;
        ref.current.scrollTop = ref.current.scrollTop - walkY;

        setStartX(x);
        setStartY(y);
    }, [isDragging, startX, startY]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    // --- TOUCH EVENTS ---
    const handleTouchStart = useCallback((e: TouchEvent) => {
        if (!ref.current) return;
        // e.preventDefault(); // Don't prevent default here to allow clicking
        setIsDragging(true);
        setStartX(e.touches[0].pageX);
        setStartY(e.touches[0].pageY);
    }, []);

    const handleTouchMove = useCallback((e: TouchEvent) => {
        if (!isDragging || !ref.current) return;

        // Prevent native scroll
        if (e.cancelable) e.preventDefault();
        e.stopPropagation();

        const x = e.touches[0].pageX;
        const y = e.touches[0].pageY;
        const walkX = (x - startX) * 1.5;
        const walkY = (y - startY) * 1.5;

        ref.current.scrollLeft = ref.current.scrollLeft - walkX;
        ref.current.scrollTop = ref.current.scrollTop - walkY;

        setStartX(x);
        setStartY(y);
    }, [isDragging, startX, startY]);

    const handleTouchEnd = useCallback(() => {
        setIsDragging(false);
    }, []);

    // Attach global listeners
    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchmove', handleTouchMove, { passive: false });
            window.addEventListener('touchend', handleTouchEnd);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

    // Attach Touch Start directly to ref via ref callback or effect 
    // because React's onTouchStart is passive by default in some versions, 
    // but easier to just use the returned props for mouse and effect for touch if needed.
    // Actually, for simplicity in React, we can attach onTouchStart via props.

    return {
        ref,
        isDragging,
        events: {
            onMouseDown: handleMouseDown,
            onTouchStart: (e: React.TouchEvent) => {
                // Bridge React touch event to our logic
                setIsDragging(true);
                setStartX(e.touches[0].pageX);
                setStartY(e.touches[0].pageY);
            }
        },
        cursorClass: isDragging ? 'cursor-grabbing' : 'cursor-grab'
    };
};
