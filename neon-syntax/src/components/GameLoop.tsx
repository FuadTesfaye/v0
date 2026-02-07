
'use client';
import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';

export function GameLoop() {
    const { tick, status } = useGameStore();

    useEffect(() => {
        let requestRef: number;
        let lastTimeRef = 0;

        const loop = (time: number) => {
            if (lastTimeRef !== 0) {
                const delta = time - lastTimeRef;
                // Cap delta to prevent huge jumps if tab inactive
                const cappedDelta = Math.min(delta, 100);
                tick(cappedDelta);
            }
            lastTimeRef = time;
            requestRef = requestAnimationFrame(loop);
        };

        if (status === 'PLAYING') {
            requestRef = requestAnimationFrame(loop);
        } else {
            lastTimeRef = 0;
            // No cleanup needed here as useEffect cleanup handles cancel
        }

        return () => {
            if (requestRef) cancelAnimationFrame(requestRef);
        };
    }, [status, tick]);

    return null; // Logic only component
}
