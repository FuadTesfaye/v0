import { z } from 'zod';
import { ActionType, NodeType } from './types';

export const NodeSchema = z.object({
    id: z.string(),
    type: z.nativeEnum(NodeType),
    x: z.number(),
    y: z.number(),
});

export const ActionSchema = z.object({
    type: z.nativeEnum(ActionType),
    playerId: z.string(),
    sourceId: z.string().optional(),
    targetId: z.string(),
    amount: z.number().positive(),
    timestamp: z.number(),
});

export const GameConfigSchema = z.object({
    tickRate: z.number().default(10), // ticks per second
    captureSpeed: z.number().default(5), // progress per tick
    energyDecay: z.number().default(0.1), // energy loss per distance/tick
});
