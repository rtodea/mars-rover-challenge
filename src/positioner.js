import { Direction, MoveCommand } from "./constants.js";

const Rotation = {
  Left90Degrees: -90,
  Right90Degrees: 90,
};

const rotate = (position, rotation) => {
  const LeftDirectionRotation = {
    [Direction.North]: Direction.West,
    [Direction.West]: Direction.South,
    [Direction.South]: Direction.East,
    [Direction.East]: Direction.North,
  };

  const RightDirectionRotation = {
    [Direction.North]: Direction.East,
    [Direction.East]: Direction.South,
    [Direction.South]: Direction.West,
    [Direction.West]: Direction.North,
  };

  const rotationToDirectionMap = {
    [Rotation.Left90Degrees]: LeftDirectionRotation,
    [Rotation.Right90Degrees]: RightDirectionRotation,
  };

  const directionMap = rotationToDirectionMap[rotation];
  if (!directionMap) {
    return position;
  }

  return {
    ...position,
    direction: directionMap[position.direction],
  };
};

const TranslationStep = {
  Positive: +1,
  Negative: -1,
};

const translate = ({ x, y, direction }, translationStep) => {
  const directionToDelta = {
    [Direction.North]: { dx: 0, dy: 1 },
    [Direction.East]: { dx: 1, dy: 0 },
    [Direction.South]: { dx: 0, dy: -1 },
    [Direction.West]: { dx: -1, dy: 0 },
  };

  const delta = directionToDelta[direction];
  return {
    direction,
    x: x + delta.dx * translationStep,
    y: y + delta.dy * translationStep,
  };
};

const move = (prevPosition, command) => {
  if (
    !prevPosition ||
    Number.isNaN(Number.parseInt(prevPosition.x)) ||
    Number.isNaN(Number.parseInt(prevPosition.y)) ||
    !prevPosition.direction ||
    !Object.values(Direction).some(d => d === prevPosition.direction)
  ) {
    return prevPosition;
  }

  const commandToAction = {
    [MoveCommand.Left90Degrees]: p => rotate(p, Rotation.Left90Degrees),
    [MoveCommand.Right90Degrees]: p => rotate(p, Rotation.Right90Degrees),
    [MoveCommand.Forward]: p => translate(p, TranslationStep.Positive),
    [MoveCommand.Backwards]: p => translate(p, TranslationStep.Negative),
  };

  const action = commandToAction[command];
  if (!action) {
    return prevPosition;
  }

  return action(prevPosition);
};

export { move };
