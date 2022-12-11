import { move } from "./positioner.js";
import { Direction, MoveCommand } from "./constants.js";

class Rover {
  state = { x: 0, y: 0, direction: Direction.North };

  init(x = 0, y = 0, direction = Direction.North) {
    this.state = { x, y, direction };
  }

  setState(state) {
    this.state = state;
  }

  getState() {
    return this.state;
  }

  execute(commandListAsString) {
    const allowedCommands = {
      [MoveCommand.Backwards]: true,
      [MoveCommand.Forward]: true,
      [MoveCommand.Left90Degrees]: true,
      [MoveCommand.Right90Degrees]: true,
    };
    for (const command of commandListAsString) {
      if (!allowedCommands[command]) {
        break;
      }

      this.setState(move(this.state, command));
    }
  }

  toString() {
    const { x, y, direction } = this.state;
    return `(${x}, ${y}) ${direction}`;
  }
}

export { Rover };
