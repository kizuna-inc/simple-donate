import { Express, Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";

import { socketRouteController } from "./Routes";
import { sWorker } from "./queue";

export const socketServer = async (app: Express) => {
  const server = createServer(app);
  const port = Number(process.env.PORT) || 3000;

  const io = new Server(server, {
    cors: {
      origin: "localhost",
    },
  });

  await socketRouteController(app, io);

  sWorker.on("completed", (job) => {
    io.emit(`${process.env.ROOM_NAME || "simple-donate"}_screen`, job.data);
  });

  sWorker.on("failed", (job, err) => {
    console.error(`${job?.id} is failed with error message --> ${err}`);
  });

  server.listen(port, () => {
    console.clear();
    console.log("");
    console.log(`server started at http://localhost:${port}`);
    console.log("");
  });
};
