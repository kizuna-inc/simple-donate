import { Request, Response } from "express";
import fs from "fs";
import { Jimp } from "jimp";
import jsQR from "jsqr";
import path from "path";

import { verifyPayload } from "../../../modules/interface/payload";

import { ISlip2SureBankslip } from "../../../modules/interface/slip/type/bank";
import { slipClient } from "../../../modules/slip/client";

import { reResp } from "../../../modules/response/main";

export const uploadSlip = async (req: Request, res: Response, root: string) => {
  const file = req.file;

  const response = new reResp<verifyPayload>();

  let qrPayload: ISlip2SureBankslip | null = null;

  if (file === undefined || file === null) {
    response.message = "no file uploaded..";
    return;
  }

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

  response.status = 1;
  response.message = "check slip successful";
  response.payload = finalPayload;

  res.send(response);
};
