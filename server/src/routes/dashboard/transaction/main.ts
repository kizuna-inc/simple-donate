import { Express, Request, Response } from "express";

import { TransactionInterface } from "../../../modules/interface/dashboard/transaction";

import { reResp } from "../../../modules/response/main";
import { jwtAuthFunc } from "../../../modules/providers/auth";
import { client } from "../../../modules/db/client";

export const transactionRoutes = async (app: Express) => {
  app.get("/api/dashboard/transaction", async (req: Request, res: Response) => {
    const resp = new reResp<TransactionInterface[]>();

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

    // Call Transaction
    const transactionList = (await client.transection.findMany({
      orderBy: {
        create_at: "desc",
      },
    })) as TransactionInterface[];

    resp.status = 1;
    resp.message = "fetch successful!";
    resp.payload = transactionList;

    res.send(resp);
  });
};
