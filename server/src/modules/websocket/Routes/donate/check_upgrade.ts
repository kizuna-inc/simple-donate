import { Request, Response } from "express";
import fs from "fs";
import { Jimp } from "jimp";
import jsQR from "jsqr";
import path from "path";

import { client } from "../../../db/client";
import { streamTemplate } from "../../../db/mock";

import { reResp } from "../../../response/main";
import type { verifyPayload } from "../../../interface/payload";
import type { ISlip2SureBankslip } from "../../../interface/slip/type/bank";

import { sQueue } from "../../queue";
import { bankChecker } from "../../../parser/bank";
import { slipClient } from "../../../slip/client";

const root = path.resolve(
  __dirname,
  process.env.MODE === "PROD" ? "../../../../../../" : "../../../../../"
);

const resp = new reResp();

const turnstileCheck = async (token: string) => {
  if (process.env.TURNSTILE_SECRET === undefined) {
    return false;
  }

  const formData = new FormData();
  formData.append("secret", process.env.TURNSTILE_SECRET);
  formData.append("response", token);

  try {
    const verifyTurnstile = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!verifyTurnstile.ok) {
      resp.message = "turnstile send unsuccess";
      resp.payload = (await verifyTurnstile.json())["error-codes"];

      return false;
    } else {
      resp.message = "turnstile send success";

      return true;
    }
  } catch (e: any) {
    const err = e as Error;

    console.error("Turnstile validation error:", err.message);

    resp.status = 0;
    resp.message = "Turnstile Error";
    resp.payload = {
      "error-codes": ["internal-error"],
    };

    return false;
  }
};

const slipCheck = async (file: Express.Multer.File) => {
  let qrPayload: ISlip2SureBankslip | null = null;

  const pathFile = path.resolve(path.join(root, String(file.path)));
  const readFile = fs.readFileSync(pathFile);

  const read = await Jimp.read(readFile);
  const imgData = {
    data: new Uint8ClampedArray(read.bitmap.data),
    width: read.bitmap.width,
    height: read.bitmap.height,
  };

  const decoded = jsQR(imgData.data, imgData.width, imgData.height);

  if (!decoded) {
    throw new Error("QR not found");
  }

  // Call API
  qrPayload = await slipClient.bankSlip(String(decoded.data));

  fs.rmSync(pathFile);

  let finalPayload: verifyPayload;

  if (
    qrPayload.info.receiver.proxy.type !== null &&
    qrPayload.info.receiver.account.type === null
  ) {
    finalPayload = {
      payload: qrPayload.info.payload,
      transRef: qrPayload.info.transRef,
      amount: qrPayload.info.amount,
      transDateTime: qrPayload.info.transDateTime,
      receiver: {
        name: qrPayload.info.receiver.displayName,
        type: qrPayload.info.receiver.proxy.type,
        value: qrPayload.info.receiver.proxy.value,
      },
    };
  } else {
    finalPayload = {
      payload: qrPayload.info.payload,
      transRef: qrPayload.info.transRef,
      amount: qrPayload.info.amount,
      transDateTime: qrPayload.info.transDateTime,
      receiver: {
        name: qrPayload.info.receiver.displayName,
        type: qrPayload.info.receiver.account.type,
        value: qrPayload.info.receiver.account.value,
      },
    };
  }

  return finalPayload;
};

const detailCheck = async (
  req: Request,
  res: Response,
  slip: verifyPayload
) => {
  const {
    name,
    message,
    amount,
    method,
  }: {
    name: string;
    message: string;
    amount: number;
    method: number;
  } = req.body;

  if (name === "" || message === "" || amount <= 0 || method < 0) {
    resp.status = 0;
    resp.message = "ยังมีบางช่องว่างอยู่ กรุณาลองใหม่อีกครั้ง";
    res.send(resp);
    return;
  }

  const config = await client.bankingConfig.findFirst({
    where: {
      type: {
        equals: Number(method),
      },
    },
  });

  if (config === undefined || config === null) {
    resp.status = 0;
    resp.message = `ผู้ใช้ยังตั้งค่าไม่สมบูรณ์ กรุณาติดต่อเจ้าของเว็บ..`;
    return;
  }

  // Check Banking Detail
  if (!bankChecker(config, slip)) {
    resp.status = 0;
    resp.message = "ปลายทางของสลิปไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง... :)";
    res.send(resp);
    return;
  }

  // Check Amount
  if (slip.amount !== Number(amount)) {
    resp.status = 0;
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
    resp.status = 0;
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
        amount: Number(amount),
        transactionID: slip.transRef,
      },
    });

    if (record === null) {
      resp.status = 0;
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

    resp.status = 0;
    resp.payload = null;
    resp.message = "Error : " + error.message;
    res.send(resp);
    return;
  }
};

export const donateCheck = async (req: Request, res: Response) => {
  const body = req.body;
  const file = req.file;

  // Check body
  if (body === null || body === undefined) {
    resp.status = 0;
    resp.message = "blank body";
    res.send(resp);

    return;
  }

  if (file === null || file === undefined) {
    resp.status = 0;
    resp.message = "no file uploaded..";
    res.send(resp);

    return;
  }

  // Turnstile check
  if (req.body.token === undefined || req.body.token === null) {
    resp.status = 0;
    resp.message = "no token provided";
    res.send(resp);
    return;
  }

  const turnstileStatus = await turnstileCheck(req.body.token);

  if (!turnstileStatus) {
    res.send(resp);
    return;
  }

  // Check Slip
  const slip: verifyPayload | null = await slipCheck(file);

  if (slip === null || slip === undefined) {
    resp.status = 0;
    resp.message = "สลิปไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง";
    res.send(resp);

    return;
  }

  await detailCheck(req, res, slip);
};
