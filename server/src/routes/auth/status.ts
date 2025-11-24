import { Express, Request, Response } from "express";

import { reResp } from "../../modules/response/main";
import { jwtAuthFunc } from "../../modules/providers/auth";

export const LoginStatusRoute = async (app: Express) => {
  app.get("/api/auth/status", async (req: Request, res: Response) => {
    const resp = new reResp<undefined>();

    if (!req.headers.authorization) {
      resp.message = "invalid header / unauthorized";
      res.send(resp.message);
      return;
    }

    // JWT?
    const authCheck = await jwtAuthFunc(req.headers.authorization);

    if (!authCheck) {
      resp.message = "invalid header / unauthorized";
      res.send(resp.message);
      return;
    }

    resp.status = 1;
    resp.message = "everything seem okay :D";
    res.send(resp);
  });
};
