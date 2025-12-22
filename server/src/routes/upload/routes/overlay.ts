import { Request, Response } from "express";
import path from "path";
import fs from "fs";

import { reResp } from "../../../modules/response/main";
import { jwtAuthFunc } from "../../../modules/providers/auth";
import { client } from "../../../modules/db/client";

export const imageUpdate = async (
  req: Request,
  res: Response,
  root: string
) => {
  const resp = new reResp<string>();

  // Check Header
  if (!(await jwtAuthFunc(req.headers.authorization))) {
    resp.message = "auth failed";
    res.send(resp);

    return;
  }

  if (req.file === undefined || req.file === null) {
    resp.message = "no input file..";
    res.send(resp);
    return;
  }

  const filePath = path.resolve(root, req.file.destination);
  const ext = req.file.originalname.split(".").reverse()[0];

  const list = fs.readdirSync(filePath);
  const file_name = "alert_img";
  let regex = /alert_img\.[A-Za-z]+/i;

  const check_file = list.find((file) => regex.test(file));

  if (check_file !== undefined) {
    fs.rmSync(path.resolve(filePath, check_file));
  }

  fs.renameSync(
    path.resolve(filePath, req.file.filename),
    path.resolve(filePath, `${file_name}.${ext}`)
  );

  try {
    const find = await client.streamAlert.findFirst();

    await client.streamAlert.update({
      where: {
        id: find?.id,
      },
      data: {
        image: `static/upload/overlay/${file_name}.${ext}`,
      },
    });

    resp.status = 1;
    resp.message = "image upload successfully!";
    resp.payload = `static/upload/overlay/${file_name}.${ext}`;

    res.send(resp);
  } catch (e: any) {
    const err = e as Error;

    resp.message = `Something error -- ${err.message}`;
    res.send(resp);
  }
};

export const soundUpdate = async (
  req: Request,
  res: Response,
  root: string
) => {
  const resp = new reResp<string>();

  // Check Header
  if (!(await jwtAuthFunc(req.headers.authorization))) {
    resp.message = "auth failed";
    res.send(resp);

    return;
  }

  if (req.file === undefined || req.file === null) {
    resp.message = "no input file..";
    res.send(resp);
    return;
  }

  const filePath = path.resolve(root, req.file.destination);
  const ext = req.file.originalname.split(".").reverse()[0];

  const list = fs.readdirSync(filePath);
  const file_name = "alert_audio";
  let regex = /alert_audio\.[A-Za-z]+/i;

  const check_file = list.find((file) => regex.test(file));

  if (check_file !== undefined) {
    fs.rmSync(path.resolve(filePath, check_file));
  }

  fs.renameSync(
    path.resolve(filePath, req.file.filename),
    path.resolve(filePath, `${file_name}.${ext}`)
  );

  try {
    const find = await client.streamAlert.findFirst();

    await client.streamAlert.update({
      where: {
        id: find?.id,
      },
      data: {
        sound: `static/upload/overlay/${file_name}.${ext}`,
      },
    });

    resp.status = 1;
    resp.message = "image upload successfully!";
    resp.payload = `static/upload/overlay/${file_name}.${ext}`;

    res.send(resp);
  } catch (e: any) {
    const err = e as Error;

    resp.message = `Something error -- ${err.message}`;
    res.send(resp);
  }
};
