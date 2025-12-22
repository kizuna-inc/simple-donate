import { Express, Request, Response } from "express";

import { reResp } from "../../../../modules/response/main";
import { client } from "../../../../modules/db/client";
import { jwtAuthFunc } from "../../../../modules/providers/auth";

export const bankingDelete = async (app: Express) => {
  app.post(
    "/api/config/banking/delete",
    async (req: Request, res: Response) => {
      const resp = new reResp<undefined>();

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

      const { id } = req.body;

      if (id === undefined || id === null) {
        resp.message = "no id";
        res.send(resp);

        return;
      }

      await client.bankingConfig.delete({
        where: {
          id: id,
        },
      });

      resp.status = 1;
      resp.message = "remove successful";
      res.send(resp);
    }
  );
};
