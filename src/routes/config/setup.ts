import { Express, Request, Response } from "express";

import { client } from "../../modules/db/client";

export const setUpRoutes = async (app: Express) => {
  app.get("/api/config/isset", async (req: Request, res: Response) => {
    const config = await client.userConfig.count();

    let resp = {
      status: 0,
      message: "",
    };

    if (config > 0) {
      resp.status = 1;
      resp.message = "Config is already set";
    } else {
      resp.message = "Config isn't set properly..";
    }

    res.send(resp);
  });

  app.post("/api/config/start", async (req: Request, res: Response) => {});
};
