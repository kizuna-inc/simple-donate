import { Express, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jwt-simple";

import { client } from "../../modules/db/client";
import { reResp } from "../../modules/response/main";
import { loginRespInterface } from "../../modules/interface/auth/login";

export const LoginRoutes = async (app: Express) => {
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    const resp = new reResp<loginRespInterface>();
    const body = req.body;

    const secret = process.env.JWT_SECERT;

    if (secret === undefined) {
      resp.message = "Backend Things, no secret in env";
      res.send(resp);
      return;
    }

    if (body === undefined) {
      resp.message =
        "ยังมีฟอร์มที่ยังว่างอยู่ หรือ ผิดพลาด กรุณาตรวจสอบอีกครั้ง";

      res.send(resp);
      return;
    }

    const user = await client.user.findFirst({
      where: {
        username: body.username,
      },
    });

    if (user === null) {
      resp.message =
        "ยังมีฟอร์มที่ยังว่างอยู่ หรือ ผิดพลาด กรุณาตรวจสอบอีกครั้ง";

      res.send(resp);
      return;
    }

    const comp = bcrypt.compareSync(body.password, user.password);

    if (!comp) {
      resp.message =
        "ยังมีฟอร์มที่ยังว่างอยู่ หรือ ผิดพลาด กรุณาตรวจสอบอีกครั้ง";

      res.send(resp);
      return;
    }

    resp.status = 1;
    resp.message = "เข้าสู่ระบบสำเร็จ";
    resp.payload = {
      username: user.username,
      token: jwt.encode(
        {
          sub: user.username,
          iat: new Date().getTime(),
        },
        secret
      ),
    };

    res.send(resp);
  });
};
