When testing the new physics logic in the game engine, we noticed that `GravitySystem` vectors sometimes go out of sync with their semantic directions. 

Specifically, when calling `rotate()`, the `vector` updates correctly based on the clockwise/counter-clockwise logic, but the `direction` string property (e.g., `'DOWN'`, `'LEFT'`) is not being updated to match the new rotated vector.

Please fix this issue in `GravitySystem.ts` so that when `rotate()` is called, the `direction` correctly reflects the new state of the gravity vector.
