import { Express, Request, Response } from "express";
import { setUpRoutes } from "./config/setup";

export const RouteController = async (app: Express) => {
  app.get("/", (req: Request, res: Response) => {
    res.send("yey :D");
  });

  await setUpRoutes(app);
};
