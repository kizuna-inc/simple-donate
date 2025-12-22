import { Express, Request, Response } from "express";

import { reResp } from "../../../../modules/response/main";

import { jwtAuthFunc } from "../../../../modules/providers/auth";
import { streamTemplate } from "../../../../modules/db/mock";
import { streamTemplateInterface } from "../../../../modules/interface/config/donation.config";

export const overlayRead = async (app: Express) => {
  app.get("/api/config/overlay", async (req: Request, res: Response) => {
    const resp = new reResp<streamTemplateInterface>();

    // Check Header
    if (!(await jwtAuthFunc(req.headers.authorization))) {
      resp.message = "auth failed";
      res.send(resp);

      return;
    }

    const items = await streamTemplate();

    resp.status = 1;
    resp.payload = items;
    res.send(resp);
  });
};
