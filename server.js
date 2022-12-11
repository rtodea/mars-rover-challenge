import { createServer } from "http";
import { Rover } from "./src/index.js";

function getReqData(req) {
  return new Promise((resolve, reject) => {
    try {
      let body = "";
      // listen to data sent by client
      req.on("data", chunk => {
        // append the string version to the body
        body += chunk.toString();
      });
      // listen till the end
      req.on("end", () => {
        // send back the data
        resolve(body);
      });
    } catch (error) {
      reject(error);
    }
  }).then(body => {
    return JSON.parse(body);
  });
}

const getInfo = () => {
  return {
    info: "Mars Rover API; send POST with sample payload at this endpoint",
    sample: {
      state: { x: 0, y: 0, direction: "NORTH" },
      command: "FFF",
    },
  };
};

const moveRover = (state, command) => {
  const rover = new Rover();
  rover.setState(state);
  rover.execute(command);
  return `${rover}`;
};

const server = createServer(async (req, res) => {
  //set the request route
  const contentType = { "Content-Type": "application/json" };

  if (req.url === "/api") {
    res.writeHead(200, contentType);
    if (req.method === "GET") {
      res.end(JSON.stringify(getInfo()));
    }
    if (req.method === "POST") {
      const { state, command } = await getReqData(req);
      res.end(JSON.stringify({ result: moveRover(state, command) }));
    }
  }
  // If no route present
  else {
    res.writeHead(404, contentType);
    res.end(JSON.stringify({ message: "Route not found" }));
  }
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server listening at: http://localhost:${PORT}\n`);
  console.log(
    `curl -X POST http://localhost:5000/api -H 'Content-Type: application/json' -d '{"state": {"x": 0, "y": 0, "direction": "NORTH"}, "command": "FFF"}'`
  );
});
