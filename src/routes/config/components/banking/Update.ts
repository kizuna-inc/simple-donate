import { Express, Request, Response } from "express";
import { reResp } from "../../../../modules/response/main";
import { BankingInterface } from "../../../../modules/interface/config/body";
import { client } from "../../../../modules/db/client";
import { jwtAuthFunc } from "../../../../modules/providers/auth";
import { equal } from "assert";

export const bankingUpdate = async (app: Express) => {
  app.post(
    "/api/config/banking/update",
    async (req: Request, res: Response) => {
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

      if (
        body.id === undefined ||
        body.name === undefined ||
        body.no === undefined ||
        body.type > 1 ||
        body.type < 0 ||
        body.type === undefined
      ) {
        resp.message = "some form is blank";
        res.send(resp);

        return;
      }

      try {
        const newBody = await client.bankingConfig.update({
          where: {
            id: body.id,
          },
          data: {
            name: body.name,
            type: body.type,
            no: body.no,
            bank: body.bank,
          },
        });

        resp.status = 1;
        resp.message = "create new user successful";
        resp.payload = newBody;

        res.send(resp);
      } catch (e: any) {
        let err = e as Error;

        resp.message = `something error happened -- ${err.message}`;
        res.send(resp);
      }
    }
  );
};
