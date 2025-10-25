import { Express, Request, Response } from "express";
import { Server } from "socket.io";
import { Jimp } from "jimp";
import path, { dirname } from "path";
import jsQR from "jsqr";
import fs from "fs";

import { responseInterface } from "../../interface/resp";
import { ISlip2SureBankslip } from "../../interface/slip/type/bank";

import { upload } from "../../files/client";
import { sQueue } from "../queue";
import { slipClient } from "../../slip/client";
import { payloadInterface } from "../../interface/payload";

export const socketAPI = async (app: Express, io: Server) => {
  // const root = path.resolve(__dirname, "../../../../", "/static/upload/slip");
  const root = path.resolve(__dirname, "../../../../");

  app.post(
    "/api/socket/donate",
    upload.single("slip"),
    async (req: Request, res: Response) => {
      const body = req.body;
      const file = req.file;

      let qrPayload: ISlip2SureBankslip | null = null;

      let response: responseInterface = {
        status: 0,
        message: "",
        payload: null,
      };

      if (file !== undefined && file !== null) {
        let filePath = path.resolve(path.join(root, String(file.path)));
        const readFile = fs.readFileSync(filePath); // Or you can use expressJS (Mutler,express-fileupload) for integration

        const image = await Jimp.read(readFile);
        const imgData = {
          data: new Uint8ClampedArray(image.bitmap.data),
          width: image.bitmap.width,
          height: image.bitmap.height,
        };

        const decoded = jsQR(imgData.data, imgData.width, imgData.height);

        if (!decoded) {
          throw new Error("QR not found");
        }

        // Call API
        qrPayload = await slipClient.bankSlip(String(decoded.data));

        fs.rmSync(filePath);

        if (body !== undefined && body !== null && body !== "") {
          let userForm = ["name", "amount", "text"];

          // Check Undefined..
          for (let i = 0; i < userForm.length; i++) {
            if (
              body[userForm[i]] == null &&
              body[userForm[i]] == undefined &&
              body[userForm[i]] == ""
            ) {
              response.message = `${userForm[i]} is blank..`;

              res.send(response);
              return;
            }
          }

          // Doing something to db now..
          let finalPayload: payloadInterface = {
            name: body[userForm[0]],
            amount: body[userForm[1]],
            text: body[userForm[2]],
            verify: {
              payload: qrPayload.info.payload,
              transRef: qrPayload.info.transRef,
              amount: qrPayload.info.amount,
              transDateTime: qrPayload.info.transDateTime,
              receiver: {
                name: qrPayload.info.receiver.displayName,
                type: qrPayload.info.receiver.account.type,
                value: qrPayload.info.receiver.account.value,
              },
            },
          };

          // Check Name

          // Check Account

          // Check Amount
          if (finalPayload.amount !== finalPayload.verify.amount) {
            response.message = "amount not match";
            res.send(response);
            return;
          }
        }
      } else {
        response.message = "no slip got uploaded..";

        res.send(response);
        return;
      }
    }
  );

  app.get("/api/socket/test", async (_: Request, res: Response) => {
    let response: responseInterface = {
      status: 1,
      message: "ping successful :D",
      payload: null,
    };

    const testPayload = {
      username: "test",
      money: 10.0,
      template: {
        image: "",
        text: "thank you for",
      },
    };

    await sQueue.add(
      `${process.env.ROOM_NAME || "simple-donate"}_screen`,
      testPayload
    );

    res.send(response);
  });

  app.post(
    "/api/socket/upload",
    upload.single("slip"),
    async (req: Request, res: Response) => {
      let file = req.file;

      res.send(file);
    }
  );
};
