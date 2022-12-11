import { expect } from "chai";
import { Rover } from "../src/rover.js";
import { Direction } from "../src/constants.js";

describe("Rover", () => {
  it("should initialize", () => {
    const rover = new Rover();
    rover.init(6, 4, Direction.North);
    expect(rover.getState()).eql({ x: 6, y: 4, direction: Direction.North });
    expect(rover.toString()).eql("(6, 4) NORTH");
  });

  it("should move on single command", () => {
    const rover = new Rover();
    rover.init(0, 0, Direction.West);
    rover.execute("F");
    expect(rover.toString()).eql("(-1, 0) WEST");
  });

  it("should not do anything on bad command", () => {
    const rover = new Rover();
    rover.init(0, 0, Direction.West);
    rover.execute("X");
    expect(rover.toString()).eql("(0, 0) WEST");
  });

  it("should execute list of commands", () => {
    const rover = new Rover();
    rover.init(0, 0, Direction.West);
    rover.execute("FLFFFRFLB");
    expect(rover.toString()).eql("(-2, -2) SOUTH");
  });

  it("should stop at first bad command", () => {
    const rover = new Rover();
    rover.init(0, 0, Direction.East);
    rover.execute("FFXFF");
    expect(rover.toString()).eql("(2, 0) EAST");
  });

  it("should do a predefined sequence and turn back to origin", () => {
    const rover = new Rover();
    rover.init(0, 0, Direction.East);
    rover.execute("FFFBBBRFFBBLBBFF");
    expect(rover.toString()).eql("(0, 0) EAST");
  });

  const gridCells = `
    (0,  0) (1,  0) (2,  0) (3,  0)
    (0, -1) (1, -1) (2, -1) (3, -1)
    (0, -2) (1, -2) (2, -2) (3, -2)
    (0, -3) (1, -3) (2, -3) (3, -3)
  `;
  const firstCommands = `
   > > >/v
       v
       v
  `;
  const secondCommands = `
  < < ^/<
      ^
      v/>/^
  `;
  it("should solve this sequence: " + [gridCells, firstCommands, secondCommands].join("\n"), () => {
    const rover = new Rover();
    rover.init(0, 0, Direction.East);
    rover.execute("FFFRFFF");
    expect(rover.toString()).eql("(3, -3) SOUTH");
    rover.execute("LLFFFLFFF");
    expect(rover.toString()).eql("(0, 0) WEST");
  });
});
