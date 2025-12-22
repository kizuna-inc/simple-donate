import { Express, Request, Response } from "express";

import { reResp } from "../../../../modules/response/main";
import { BankingInterface } from "../../../../modules/interface/config/body";
import { client } from "../../../../modules/db/client";
import { jwtAuthFunc } from "../../../../modules/providers/auth";

export const bankingCreate = async (app: Express) => {
  app.post("/api/config/banking/new", async (req: Request, res: Response) => {
    const resp = new reResp<BankingInterface>();

    // Check Header
    if (!(await jwtAuthFunc(req.headers.authorization))) {
      resp.message = "auth failed";
      res.send(resp);

      return;
    }

    if (req.body === undefined || req.body === null) {
      resp.message = "blank body";
      res.send(resp);
      return;
    }

    const body: BankingInterface = req.body;

    const newBody = await client.bankingConfig.create({
      data: {
        name: body.name,
        type: Number(body.type),
        no: body.no,
        bank: body.bank !== undefined ? body.bank : "",
        user_id: 1,
      },
    });

    console.log(newBody);

    resp.status = 1;
    resp.message = "create successful!";
    resp.payload = newBody;
    res.send(resp);
  });
};
