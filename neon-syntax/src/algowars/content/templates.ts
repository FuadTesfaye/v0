
import { ProblemTemplate, ProblemCluster } from '../types/ranked';

export const PROBLEM_TEMPLATES: Record<string, ProblemTemplate> = {
    'p_two_sum': {
        id: 'p_two_sum',
        title: 'Two Sum',
        description: 'Find two numbers in an array that add up to a target.',
        cluster: [ProblemCluster.AGGRESSION],
        difficulty: 1,
        baseCode: 'function twoSum(nums, target) {\n  // Your code here\n}',
        testCases: [
            { input: [[2, 7, 11, 15], 9], output: [0, 1] },
            { input: [[3, 2, 4], 6], output: [1, 2] }
        ]
    },
    'p_climb_stairs': {
        id: 'p_climb_stairs',
        title: 'Climbing Stairs',
        description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps.',
        cluster: [ProblemCluster.CONTROL], // DP usually fits Control
        difficulty: 2,
        baseCode: 'function climbStairs(n) {\n  // Your code here\n}',
        testCases: [
            { input: [2], output: 2 },
            { input: [3], output: 3 }
        ]
    },
    'p_single_number': {
        id: 'p_single_number',
        title: 'Single Number',
        description: 'Given a non-empty array of integers, every element appears twice except for one. Find that single one.',
        cluster: [ProblemCluster.DECEPTION], // Bit manipulation / XOR trick
        difficulty: 2,
        baseCode: 'function singleNumber(nums) {\n  // Your code here\n}',
        testCases: [
            { input: [[2, 2, 1]], output: 1 },
            { input: [[4, 1, 2, 1, 2]], output: 4 }
        ]
    },
    'p_max_subarray': {
        id: 'p_max_subarray',
        title: 'Maximum Subarray',
        description: 'Find the contiguous subarray which has the largest sum.',
        cluster: [ProblemCluster.AGGRESSION, ProblemCluster.CONTROL],
        difficulty: 3,
        baseCode: 'function maxSubArray(nums) {\n  // Your code here\n}',
        testCases: [
            { input: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], output: 6 }
        ]
    },
    'p_lru_cache': {
        id: 'p_lru_cache',
        title: 'LRU Cache',
        description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.',
        cluster: [ProblemCluster.ENDGAME], // Optimization & System Design
        difficulty: 6,
        baseCode: 'class LRUCache {\n  constructor(capacity) {\n  }\n\n  get(key) {\n  }\n\n  put(key, value) {\n  }\n}',
        testCases: []
    }
};

export function getProblemById(id: string): ProblemTemplate | undefined {
    return PROBLEM_TEMPLATES[id];
}

export function getRandomProblem(difficulty: number): ProblemTemplate {
    const keys = Object.keys(PROBLEM_TEMPLATES);
    // Simple random for now
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return PROBLEM_TEMPLATES[randomKey];
}
