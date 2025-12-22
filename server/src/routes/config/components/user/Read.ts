import { Express, Request, Response } from "express";

import type { itemInterface } from ".";

import { reResp } from "../../../../modules/response/main";

import { jwtAuthFunc } from "../../../../modules/providers/auth";
import { client } from "../../../../modules/db/client";

export const UserRead = async (app: Express) => {
  app.get("/api/config/user", async (req: Request, res: Response) => {
    const resp = new reResp<itemInterface>();

    // Check Header
    if (!(await jwtAuthFunc(req.headers.authorization))) {
      resp.message = "auth failed";
      res.send(resp);

      return;
    }

    const loadUser = await client.user.findFirst();
    const loadDetail = await client.userConfig.findFirst();
    const loadBank = await client.bankingConfig.findMany();
    const loadConfig = await client.streamConfig.findFirst();

    resp.payload = {
      login: {
        username: loadUser?.username,
      },
      detail: {
        name: loadDetail?.name,
        description: loadDetail?.description,
        profileImage: loadDetail?.profileImage,
        backgroundImage: loadDetail?.profileImage,
      },
      bank: loadBank,
      config: {
        minAmount: loadConfig?.min_amount,
        order: loadConfig?.banking_order,
      },
    };

    resp.status = 1;
    resp.message = "fetch success";

    res.send(resp);
  });
};
