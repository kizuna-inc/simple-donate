import { Express, Request, Response } from "express";

import { setUpRoutes } from "./config/setup";
import { callConfigRoutes } from "./config/callConfig";
import { componentsController } from "./config/components.controller";

import { LoginRoutes } from "./auth/login";
import { LoginStatusRoute } from "./auth/status";

import { uploadRoutes } from "./upload/main";
import { transactionRoutes } from "./dashboard/transaction/main";
import { summaryRoute } from "./dashboard/summary/main";

export const RouteController = async (app: Express) => {
  app.get("/", (_req: Request, res: Response) => {
    res.send("yey :D");
  });

  // Config
  await setUpRoutes(app);
  await callConfigRoutes(app);

  // Edit Config
  await componentsController(app);

  // Authentication
  await LoginRoutes(app);
  await LoginStatusRoute(app);

  // Dashboard
  await summaryRoute(app);
  await transactionRoutes(app);

  // Utilities
  await uploadRoutes(app);
};
