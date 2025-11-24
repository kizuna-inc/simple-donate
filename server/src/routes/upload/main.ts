import { Express, Request, Response } from "express";
import path from "path";
import fs, { read } from "fs";
import { Jimp } from "jimp";
import jsQR from "jsqr";

import { verifyPayload } from "../../modules/interface/payload";

import { ISlip2SureBankslip } from "../../modules/interface/slip/type/bank";
import { slipClient } from "../../modules/slip/client";

import { imgUpload, upload } from "../../modules/files/client";
import { reResp, ResponsiveResp } from "../../modules/response/main";

export const uploadRoutes = async (app: Express) => {
  const root = path.resolve(__dirname, "../../../");

  app.post(
    "/api/upload/image",
    imgUpload.single("image"),
    async (req: Request, res: Response) => {
      let resp = new ResponsiveResp();

      if (req.body === undefined) {
        resp.message = "blank body..";
        res.send(resp);
        return;
      }

      if (req.file === undefined || req.file === null) {
        resp.message = "no input file..";
        res.send(resp);
        return;
      }

      const { type } = req.body;

      if (type === undefined || type === null || type === "") {
        resp.message = "missing type..";
        res.send(resp);
        return;
      }

      if (type !== "profile" && type !== "background") {
        resp.message = "type error.. Try again..";
        res.send(resp);
        return;
      }

      const filePath = path.resolve(
        __dirname,
        "../../../",
        req.file.destination
      );

      const ext = req.file.originalname.split(".").reverse()[0];

      if (type === "profile") {
        fs.renameSync(
          path.resolve(filePath, req.file.filename),
          path.resolve(filePath, `profile.${ext}`)
        );

        resp.status = 1;
        resp.message = "profile upload successful!";
        resp.payload = `static/upload/cdn/profile.${ext}`;

        res.send(resp);
      }

      if (type === "background") {
        fs.renameSync(
          path.resolve(filePath, req.file.filename),
          path.resolve(filePath, `bg.${ext}`)
        );

        resp.status = 1;
        resp.message = "background upload successful!";
        resp.payload = `static/upload/cdn/bg.${ext}`;

        res.send(resp);
      }
    }
  );

  app.post(
    "/api/upload/slip",
    upload.single("slip"),
    async (req: Request, res: Response) => {
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
    }
  );
};
