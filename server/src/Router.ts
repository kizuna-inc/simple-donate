import { Express } from "express";
import { RouteController } from "./routes";

export const Router = async (app: Express) => {
  await RouteController(app);
};
