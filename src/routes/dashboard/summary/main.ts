import { Express, Request, Response } from "express";

import { summaryInterface } from "../../../modules/interface/dashboard/summary";

import { reResp } from "../../../modules/response/main";
import { client } from "../../../modules/db/client";
import { summaryClass, widget } from "../../../modules/response/summary";

export const summaryRoute = async (app: Express) => {
  app.get("/api/dashboard/summary", async (req: Request, res: Response) => {
    const resp = new reResp<summaryInterface>();
    const summary = new summaryClass();
    const widgetResp = new widget();

    // Today Amount
    const donateToday = await client.transection.findMany({
      where: {
        create_at: new Date(),
      },
    });

    // Calculate
    var todayAmount = 0;

    if (donateToday.length > 0) {
      for (let i = 0; i < donateToday.length; i++) {
        const payload = donateToday[i];

        todayAmount += payload.amount;
      }
    }

    widgetResp.today = todayAmount;

    // Total Amount
    const donateTotal = await client.transection.findMany();

    // Calculate
    var totalAmount = 0;

    if (donateTotal.length > 0) {
      for (let i = 0; i < donateTotal.length; i++) {
        const payload = donateTotal[i];

        totalAmount += payload.amount;
      }
    }

    widgetResp.all_time = totalAmount;

    summary.widget = widgetResp;

    resp.payload = summary as summaryInterface;

    resp.status = 1;
    res.send(resp);
  });
};
