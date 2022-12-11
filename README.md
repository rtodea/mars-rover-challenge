# Mars Rover Positioner

Model a rover moving on Mars via multiple commands.
This exports a ```Rover``` instance to be used in your projects.

Sample code in NodeJS interpreter (if needed start with `node --experimental-loader=module`)

```js
const { Rover } = await import("./src/index.js");
const rover = new Rover();
rover.init(0, 0, "NORTH");
rover.execute("FFF");
console.log(`${rover}`); // (0, 3) NORTH
```

Some constants are exported for convenience:
```js
const { Rover, Direction, MoveCommand } = await import("./src/index.js");
const rover = new Rover();
rover.init(0, 0, Direction.North);
rover.execute([
  MoveCommand.Forward,
  MoveCommand.Forward,
  MoveCommand.Forward
].join());
console.log(`${rover}`);
```

Other convenience methods:

```js
rover.setState({x: 0, y: 0, direction: "NORTH"})
rover.getState()
rover.toString() // making sure it prints nice when used in `${}` strings
```

## Docker Image

## Developer Instructions 

### Installation 

NodeJS:

1. Install `nvm` for managing different NodeJS versions
2. `nvm use` to install the correct NodeJS version

Dependencies
```bash
npm ci
``` 

### Tests

```bash
npm test
```

## Server

We prepared a server to listen on `http://localhost:5000/api` to test out the solution.

Start it:
```bash
npm start
```

Interact with it:
```bash
curl -X POST http://localhost:5000/api -H 'Content-Type: application/json' -d '{"state": {"x": 0, "y": 0, "direction": "NORTH"}, "command": "FFF"}'
```
