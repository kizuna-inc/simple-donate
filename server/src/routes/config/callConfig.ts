import { Express, Request, Response } from "express";

import { client } from "../../modules/db/client";
import { reResp } from "../../modules/response/main";
import {
  BankingPayload,
  ConfigPayload,
  DetailPayload,
} from "../../modules/response/db.payload";

export const callConfigRoutes = async (app: Express) => {
  app.get("/api/config", async (req: Request, res: Response) => {
    const resp = new reResp();

    const payload = new ConfigPayload();
    payload.banking = [];

    const config = new DetailPayload();

    // UserConfig
    const detailData = await client.userConfig.findFirst();
    if (detailData != null) {
      config.name = detailData.name;
      config.description = detailData.description;
      config.profileImage = detailData.profileImage;
      config.backgroundImage = detailData.backgroundImage;

      payload.detailed = config;
    }

    const bankData = await client.bankingConfig.findMany({
      orderBy: {
        id: "asc",
      },
    });
    if (bankData != null) {
      if (bankData.length > 0) {
        for (let i = 0; i < bankData.length; i++) {
          const banking = new BankingPayload();

          let data = bankData[i];

          banking.name = data.name;
          banking.no = data.no;
          banking.type = data.type;

          if (data.type === 1) {
            banking.bank = data.bank;
          }

          payload.banking.push(banking);
        }
      }
    }

    resp.status = 1;
    resp.message = "fetch successful";
    resp.payload = payload;

    res.send(resp);
  });
};
