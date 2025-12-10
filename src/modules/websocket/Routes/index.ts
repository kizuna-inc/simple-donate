import { Express, Request, Response } from "express";
import { Server } from "socket.io";

import { socketConnection } from "./connection";
import { socketAPI } from "./apis";

export const socketRouteController = async (app: Express, io: Server) => {
  await socketConnection(io);
  await socketAPI(app, io);
};
