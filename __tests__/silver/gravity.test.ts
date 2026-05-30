import { GravitySystem } from "../../src/engine/physics/GravitySystem";

describe("GravitySystem direction sync", () => {
  let gravity: GravitySystem;

  beforeEach(() => {
    gravity = new GravitySystem();
  });

  test("should update semantic direction when rotating clockwise", () => {
    gravity.rotate(true);
    expect(gravity.state.vector).toEqual({ x: -1, y: 0 });
    expect(gravity.state.direction).toBe('LEFT');
  });

  test("should flip direction correctly", () => {
    gravity.flip();
    expect(gravity.state.vector).toEqual({ x: 0, y: -1 });
    expect(gravity.state.direction).toBe('UP');
  });
});
