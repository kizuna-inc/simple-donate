import { Express, Request, Response } from "express";
import { Server } from "socket.io";

import { responseInterface } from "../../interface/resp";
import { verifyPayload } from "../../interface/payload";

import { sQueue } from "../queue";
import { reResp } from "../../response/main";
import { client } from "../../db/client";
import { bankChecker } from "../../parser/bank";
import { streamTemplate } from "../../db/mock";

export const socketAPI = async (app: Express, io: Server) => {
  app.get("/api/socket/test", async (_: Request, res: Response) => {
    let response: responseInterface = {
      status: 1,
      message: "ping successful :D",
      payload: null,
    };

    const testPayload = {
      username: "test",
      money: 10.0,
      message: "test donation alert!",
      template: streamTemplate,
    };

    await sQueue.add(
      `${process.env.ROOM_NAME || "simple-donate"}_screen`,
      testPayload
    );

    res.send(response);
  });

  app.post("/api/socket/donate", async (req: Request, res: Response) => {
    const body = req.body;
    const resp = new reResp();

    // Check body
    if (body === null || body === undefined) {
      resp.message = "blank body";
      res.send(resp);
      return;
    }

    const {
      name,
      message,
      amount,
      method,
      slip,
    }: {
      name: string;
      message: string;
      amount: number;
      method: number;
      slip: verifyPayload;
    } = body;

    if (name === "" || message === "" || amount <= 0 || method < 0) {
      resp.message = "ยังมีบางช่องว่างอยู่ กรุณาลองใหม่อีกครั้ง";
      res.send(resp);
      return;
    }

    const config = await client.bankingConfig.findFirst({
      where: {
        type: method,
      },
    });

    if (config === undefined || config === null) {
      resp.message = `ผู้ใช้ยังตั้งค่าไม่สมบูรณ์ กรุณาติดต่อเจ้าของเว็บ..`;
      return;
    }

    // Check Banking Detail
    if (!bankChecker(config, slip)) {
      resp.message = "ปลายทางของสลิปไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง... :)";
      res.send(resp);
      return;
    }

    // Check Amount
    if (slip.amount !== amount) {
      resp.message = "จำนวนเงินไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง";
      res.send(resp);
      return;
    }

    // Check Dupe record
    const dupe = await client.transection.findFirst({
      where: {
        transactionID: slip.transRef,
      },
    });

    if (dupe !== null) {
      resp.message = "สลิปนี้เคยถูกใช้มาแล้ว กรุณาลองใหม่อีกครั้ง";

      res.send(resp);
      return;
    }

    try {
      // Create Record
      const record = await client.transection.create({
        data: {
          name: name,
          message: message,
          amount: amount,
          transactionID: slip.transRef,
        },
      });

      if (record === null) {
        resp.message = "มีบางอย่างไม่คาดฝันเกิดขึ้น กรุณาติดต่อผู้ดูแลระบบ..";
        res.send(resp);
        return;
      }

      // Send Socket
      const payload = {
        username: name,
        money: parseFloat(String(amount)).toFixed(2),
        message: message,
        template: streamTemplate,
      };

      console.log(payload);

      await sQueue.add(
        `${process.env.ROOM_NAME || "simple-donate"}_screen`,
        payload
      );

      resp.status = 1;
      resp.message = "Transaction created!!";

      res.send(resp);
    } catch (e: unknown) {
      var error = e as Error;

      resp.message = "Error : " + error.message;
      res.send(resp);
      return;
    }
  });
};
