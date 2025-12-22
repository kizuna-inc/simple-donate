import { Express, Request, Response } from "express";

import { reResp } from "../../../../modules/response/main";
import { BankingInterface } from "../../../../modules/interface/config/body";
import { client } from "../../../../modules/db/client";
import { jwtAuthFunc } from "../../../../modules/providers/auth";

export const bankingRead = async (app: Express) => {
  app.get("/api/config/banking", async (req: Request, res: Response) => {
    const resp = new reResp<BankingInterface[]>();

    // Check Header
    if (!(await jwtAuthFunc(req.headers.authorization))) {
      resp.message = "auth failed";
      res.send(resp);

      return;
    }

    try {
      const list = await client.bankingConfig.findMany({
        orderBy: {
          id: "desc",
        },
      });

      if (list.length > 0) {
        resp.status = 1;
        resp.message = "fetch successful";
        resp.payload = list;
      } else {
        resp.status = 1;
        resp.message = "nothing to fetch";
      }
    } catch (e) {
      const err = e as Error;
      resp.message = `Error: ${err.message}`;
    }

    res.json(resp);
  });

  app.post("/api/config/banking/info", async (req: Request, res: Response) => {
    const resp = new reResp<BankingInterface>();

    // Check Header
    if (!(await jwtAuthFunc(req.headers.authorization))) {
      resp.message = "auth failed";
      res.send(resp);

      return;
    }

    const { id } = req.body;

    if (id === undefined || id === null) {
      resp.message = "no id send to backend";
      res.send(resp);

      return;
    }

    const data = await client.bankingConfig.findFirst({
      where: {
        id: id,
      },
    });

    if (data === null) {
      resp.message = "data not found";
      res.send(resp);

      return;
    }

    resp.status = 1;
    resp.message = "Got payload!";
    resp.payload = data;

    res.send(resp);
  });
};
