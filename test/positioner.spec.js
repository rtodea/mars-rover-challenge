import { expect } from "chai";
import { move } from "../src/positioner.js";
import { Direction, MoveCommand } from "../src/constants.js";

describe("Positioner", () => {
  describe("edge cases", () => {
    describe("malformed input", () => {
      it("should return input if missing direction", () => {
        const missingDirection = { x: 0, y: 0 };
        expect(move(missingDirection, MoveCommand.Backwards)).eql(missingDirection);
      });
      it("should return input if missing any of y", () => {
        const missingY = { x: 0, direction: Direction.West };
        expect(move(missingY, MoveCommand.Backwards)).eql(missingY);
      });
    });

    it("should return same position if command is an unsupported string", () => {
      expect(move({ x: 0, y: 0, direction: Direction.North }, "LEAP_FORWARD")).eql({
        x: 0,
        y: 0,
        direction: Direction.North,
      });
    });
    [undefined, null, "", 0].forEach(command => {
      it(`should remain in same position when command is ${command}`, () => {
        expect(move({ x: 0, y: 0, direction: Direction.North }, command)).eql({
          x: 0,
          y: 0,
          direction: Direction.North,
        });
      });
    });
  });

  describe("rotations", () => {
    it("should change direction from NORTH to WEST when L", () => {
      expect(move({ x: 0, y: 0, direction: Direction.North }, MoveCommand.Left90Degrees)).eql({
        x: 0,
        y: 0,
        direction: Direction.West,
      });
    });

    it("should change direction from WEST to NORTH when R", () => {
      expect(move({ x: 0, y: 0, direction: Direction.West }, MoveCommand.Right90Degrees)).eql({
        x: 0,
        y: 0,
        direction: Direction.North,
      });
    });

    describe("exhaustive pairs", () => {
      [
        { from: Direction.North, to: Direction.East, command: MoveCommand.Right90Degrees },
        { from: Direction.East, to: Direction.South, command: MoveCommand.Right90Degrees },
        { from: Direction.South, to: Direction.West, command: MoveCommand.Right90Degrees },
        { from: Direction.West, to: Direction.North, command: MoveCommand.Right90Degrees },
        { from: Direction.North, to: Direction.West, command: MoveCommand.Left90Degrees },
        { from: Direction.East, to: Direction.North, command: MoveCommand.Left90Degrees },
        { from: Direction.South, to: Direction.East, command: MoveCommand.Left90Degrees },
        { from: Direction.West, to: Direction.South, command: MoveCommand.Left90Degrees },
      ].forEach(({ from, to, command }) =>
        it(`should rotate change direction from ${from} to ${to} after ${command}`, () => {
          const initialPosition = {
            x: 0,
            y: 0,
            direction: from,
          };
          const expectedPosition = {
            x: 0,
            y: 0,
            direction: to,
          };
          expect(move(initialPosition, command)).eql(expectedPosition);
        })
      );
    });

    it("should bring you back to same direction consecutive LR or RL", () => {
      const initialPosition = {
        x: 0,
        y: 0,
        direction: Direction.East,
      };

      expect(move(move(initialPosition, MoveCommand.Left90Degrees), MoveCommand.Right90Degrees)).eql(initialPosition);
      expect(move(move(initialPosition, MoveCommand.Right90Degrees), MoveCommand.Left90Degrees)).eql(initialPosition);
    });
  });

  describe("simple moves from origin {x: 0, y: 0, direction: NORTH}", () => {
    it("should move forward", () => {
      expect(move({ x: 0, y: 0, direction: Direction.North }, MoveCommand.Forward)).eql({
        x: 0,
        y: 1,
        direction: Direction.North,
      });
    });
    describe("direction is invariant", () => {
      Object.values(Direction).forEach(direction => {
        it(`should stay from ${direction} to ${direction} when forward`, () => {
          const coordinates = { x: 0, y: 0 };
          const newPosition = move({ ...coordinates, direction }, MoveCommand.Forward);
          expect(newPosition.direction).eql(direction);
        });
      });

      Object.values(Direction).forEach(direction => {
        it(`should stay from ${direction} to ${direction} when backwards`, () => {
          const coordinates = { x: 0, y: 0 };
          const newPosition = move({ ...coordinates, direction }, MoveCommand.Backwards);
          expect(newPosition.direction).eql(direction);
        });
      });
    });

    describe("moving symmetries", () => {
      it("should bring you back when FB on NORTH", () => {
        const initialPosition = { x: 0, y: 0, direction: Direction.North };
        expect(move(move(initialPosition, MoveCommand.Forward), MoveCommand.Backwards)).eql(initialPosition);
      });
      it("should bring you back when BF on NORTH", () => {
        const initialPosition = { x: 0, y: 0, direction: Direction.North };
        expect(move(move(initialPosition, MoveCommand.Backwards), MoveCommand.Forward)).eql(initialPosition);
      });
      it("should be the same between NORTH F and SOUTH B", () => {
        const northPosition = { x: 0, y: 0, direction: Direction.North };
        const southPosition = { x: 0, y: 0, direction: Direction.South };
        const newNorthPosition = move(northPosition, MoveCommand.Forward);
        const newSouthPosition = move(southPosition, MoveCommand.Backwards);
        expect({ x: newNorthPosition.x, y: newNorthPosition.y }).eql({ x: newSouthPosition.x, y: newSouthPosition.y });
      });
      it("should be the same between WEST F and EAST B", () => {
        const westPosition = { x: 0, y: 0, direction: Direction.West };
        const eastPosition = { x: 0, y: 0, direction: Direction.East };
        const newWestPosition = move(westPosition, MoveCommand.Forward);
        const newEastPosition = move(eastPosition, MoveCommand.Backwards);
        expect({ x: newWestPosition.x, y: newWestPosition.y }).eql({ x: newEastPosition.x, y: newEastPosition.y });
      });
    });

    describe("sample moves", () => {
      const NorthDirectionMoves = [
        {
          before: { x: -1, y: -1 },
          after: { x: -1, y: 0 },
          direction: Direction.North,
          command: MoveCommand.Forward,
        },
        {
          before: { x: 0, y: 0 },
          after: { x: 0, y: 1 },
          direction: Direction.North,
          command: MoveCommand.Forward,
        },
        {
          before: { x: 0, y: 0 },
          after: { x: 0, y: -1 },
          direction: Direction.North,
          command: MoveCommand.Backwards,
        },
      ];
      const EastDirectionMoves = [
        {
          before: { x: 0, y: 0 },
          after: { x: 1, y: 0 },
          direction: Direction.East,
          command: MoveCommand.Forward,
        },
        {
          before: { x: 0, y: 0 },
          after: { x: -1, y: 0 },
          direction: Direction.East,
          command: MoveCommand.Backwards,
        },
        {
          before: { x: -2, y: -3 },
          after: { x: -1, y: -3 },
          direction: Direction.East,
          command: MoveCommand.Forward,
        },
        {
          before: { x: 2, y: 3 },
          after: { x: 1, y: 3 },
          direction: Direction.East,
          command: MoveCommand.Backwards,
        },
      ];
      const SouthDirectionMoves = [
        {
          before: { x: 0, y: 0 },
          after: { x: 0, y: -1 },
          direction: Direction.South,
          command: MoveCommand.Forward,
        },
        {
          before: { x: 0, y: 0 },
          after: { x: 0, y: 1 },
          direction: Direction.South,
          command: MoveCommand.Backwards,
        },
        {
          before: { x: -2, y: -3 },
          after: { x: -2, y: -4 },
          direction: Direction.South,
          command: MoveCommand.Forward,
        },
        {
          before: { x: 2, y: 3 },
          after: { x: 2, y: 4 },
          direction: Direction.South,
          command: MoveCommand.Backwards,
        },
      ];
      const WestDirectionMoves = [
        {
          before: { x: 0, y: 0 },
          after: { x: -1, y: 0 },
          direction: Direction.West,
          command: MoveCommand.Forward,
        },
        {
          before: { x: 0, y: 0 },
          after: { x: 1, y: 0 },
          direction: Direction.West,
          command: MoveCommand.Backwards,
        },
        {
          before: { x: -2, y: -3 },
          after: { x: -3, y: -3 },
          direction: Direction.West,
          command: MoveCommand.Forward,
        },
        {
          before: { x: 2, y: 3 },
          after: { x: 3, y: 3 },
          direction: Direction.West,
          command: MoveCommand.Backwards,
        },
      ];

      [...NorthDirectionMoves, ...EastDirectionMoves].forEach(({ before, after, direction, command }) => {
        it(`should be moving ${direction} when ${command} from (${before.x} ${before.y}) to (${after.x} ${after.y})`, () => {
          expect(move({ ...before, direction }, command)).eql({ ...after, direction });
        });
      });
    });
  });
});
