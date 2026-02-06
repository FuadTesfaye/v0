import { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';

const KEY_MAP: Record<string, [number, number]> = {
    'w': [0, -1], 'W': [0, -1],
    'ArrowUp': [0, -1],
    's': [0, 1], 'S': [0, 1],
    'ArrowDown': [0, 1],
    'a': [-1, 0], 'A': [-1, 0],
    'ArrowLeft': [-1, 0],
    'd': [1, 0], 'D': [1, 0],
    'ArrowRight': [1, 0]
};

export function useKeyboard() {
    const { moveRobot, endTurn, resetGame } = useGameStore();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const dir = KEY_MAP[e.key];

            if (dir) {
                e.preventDefault();
                moveRobot('player1', dir[0], dir[1]);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                endTurn();
            } else if (e.key === 'r' || e.key === 'R') {
                e.preventDefault();
                resetGame();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [moveRobot, endTurn, resetGame]);
}
