
'use client';
import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';

export function GameLoop() {
    const { tick, stage } = useGameStore();
    const lastTimeRef = useRef<number>(0);
    const requestRef = useRef<number>();

    const loop = (time: number) => {
        if (lastTimeRef.current !== 0) {
            const delta = time - lastTimeRef.current;
            // Cap delta to prevent huge jumps if tab inactive
            const cappedDelta = Math.min(delta, 100);
            tick(cappedDelta);
        }
        lastTimeRef.current = time;
        requestRef.current = requestAnimationFrame(loop);
    };

    useEffect(() => {
        if (stage === 'PLAYING') {
            requestRef.current = requestAnimationFrame(loop);
        } else {
            lastTimeRef.current = 0;
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        }

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [stage, tick]);

    return null; // Logic only component
}
