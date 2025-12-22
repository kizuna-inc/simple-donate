import { Express, Request, response, Response } from "express";
import bcrypt from "bcryptjs";

import { reResp } from "../../../../modules/response/main";
import { jwtAuthFunc } from "../../../../modules/providers/auth";
import { client } from "../../../../modules/db/client";
import { ConfigInterface } from "../../../../modules/interface/config/body";

export const UserUpdate = async (app: Express) => {
  app.post(
    "/api/config/user/update/login",
    async (req: Request, res: Response) => {
      const resp = new reResp<undefined>();

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

      const body: {
        username: string;
        password: string;
        newPassword: string;
      } = req.body;

      const user = await client.user.findFirst({
        where: {
          username: body.username,
        },
      });

      if (user === undefined || user === null) {
        resp.message = "no user data..";
        res.send(resp);

        return;
      }

      const comp = bcrypt.compareSync(body.password, user.password);

      if (!comp) {
        resp.message = "wrong password";
        res.send(resp);

        return;
      }

      let salt = await bcrypt.genSalt(10);
      const newPWD = await bcrypt.hash(body.newPassword, salt);

      try {
        await client.user.update({
          where: {
            username: body.username,
          },
          data: {
            password: newPWD,
            update_at: new Date(),
          },
        });

        resp.status = 1;
        resp.message = "update successful";
        res.send(resp);
      } catch (e: any) {
        const err = e as Error;

        resp.message = "Something Error -- " + err.message;
        res.send(resp);
      }
    }
  );

  app.post(
    "/api/config/user/update/detail",
    async (req: Request, res: Response) => {}
  );

  app.post(
    "/api/config/user/update/config",
    async (req: Request, res: Response) => {
      const resp = new reResp<undefined>();

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

      const body = req.body as ConfigInterface;

      const check = await client.streamConfig.findMany();

      try {
        if (check.length < 1) {
          await client.streamConfig.create({
            data: {
              min_amount: body.minAmount,
              banking_order: body.order,
            },
          });
        } else {
          await client.streamConfig.update({
            where: {
              id: check[0].id,
            },
            data: {
              min_amount: body.minAmount,
              banking_order: body.order,
              update_at: new Date(),
            },
          });
        }

        resp.status = 1;
        resp.message = "update data complete";
        res.send(resp);
      } catch (e: any) {
        const err = e as Error;

        resp.message = "some error occurred -- " + err.message;
        res.send();
      }
    }
  );

  if (
    process.env.RECOVERY !== "" &&
    process.env.RECOVERY !== undefined &&
    process.env.RECOVERY !== null
  ) {
    app.post(
      "/api/config/user/reset/login",
      async (req: Request, res: Response) => {
        const resp = new reResp<undefined>();

        if (req.body === undefined || req.body === null) {
          resp.message = "blank body";
          res.send(resp);
          return;
        }

        const body: {
          username: string;
          newPassword: string;
        } = req.body;

        let salt = await bcrypt.genSalt(10);
        const newPWD = await bcrypt.hash(body.newPassword, salt);

        try {
          await client.user.update({
            where: {
              username: body.username,
            },
            data: {
              password: newPWD,
              update_at: new Date(),
            },
          });

          resp.status = 1;
          resp.message = "update successful";

          res.send(resp);
        } catch (e: any) {
          const err = e as Error;

          resp.message = "Something Error -- " + err.message;

          res.send(resp);
        }
      }
    );
  }
};
