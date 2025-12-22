import { Express, Request, Response } from "express";
import { reResp } from "../../../../modules/response/main";
import { jwtAuthFunc } from "../../../../modules/providers/auth";
import { client } from "../../../../modules/db/client";

export const overlayUpdate = async (app: Express) => {
  app.post(
    "/api/config/overlay/update/text",
    async (req: Request, res: Response) => {
      const resp = new reResp<undefined>();

      // Check Header
      if (!(await jwtAuthFunc(req.headers.authorization))) {
        resp.message = "auth failed";
        res.send(resp);

        return;
      }

      if (req.body === undefined || req.body === null) {
        resp.message = "blank body..";
        res.send(resp);

        return;
      }

      const find = await client.streamAlert.findFirst();

      try {
        await client.streamAlert.update({
          where: {
            id: find?.id,
          },
          data: {
            text: req.body.text,
          },
        });

        resp.status = 1;
        resp.message = "update successfully";

        res.send(resp);
      } catch (e: any) {
        let err = e as Error;

        resp.message = `Error Occurred -- ${err.message}`;
        res.send(resp);
      }
    }
  );
};
