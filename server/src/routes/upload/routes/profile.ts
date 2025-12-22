import { Request, Response } from "express";
import path from "path";
import fs from "fs";

import { ResponsiveResp } from "../../../modules/response/main";
import { client } from "../../../modules/db/client";

export const uploadProfile = async (
  req: Request,
  res: Response,
  root: string
) => {
  const resp = new ResponsiveResp();

  // Check config
  const config = await client.userConfig.count();
  if (config > 0) {
    resp.message =
      "user config is already setting up and update status is not using me rn";

    res.send(resp);
    return;
  }

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

  const filePath = path.resolve(root, req.file.destination);

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
};

export const fullUpdate = async (req: Request, res: Response, root: string) => {
  const resp = new ResponsiveResp();

  if (req.body === undefined) {
    resp.message = "blank body..";
    res.send(resp);
    return;
  }

  if (req.files === undefined || req.files === null) {
    resp.message = "no input file..";
    res.send(resp);
    return;
  }

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  if (files["profile"] !== undefined) {
    const filePath = path.resolve(root, files["profile"][0].destination);
    const ext = files["profile"][0].originalname.split(".").reverse()[0];

    fs.renameSync(
      path.resolve(filePath, files["profile"][0].filename),
      path.resolve(filePath, `profile.${ext}`)
    );
  }

  if (files["background"] !== undefined) {
    const filePath = path.resolve(root, files["background"][0].destination);
    const ext = files["background"][0].originalname.split(".").reverse()[0];

    fs.renameSync(
      path.resolve(filePath, files["background"][0].filename),
      path.resolve(filePath, `bg.${ext}`)
    );
  }

  const body = req.body as { name: string; description: string };

  const search = await client.userConfig.findFirst();

  if (search === undefined) {
    resp.message = "config isn't set probably..";
    res.send(resp);
  }

  try {
    await client.userConfig.update({
      where: {
        id: search?.id,
      },
      data: {
        name: body.name,
        description: body.description,
      },
    });

    resp.status = 1;
    resp.message = "update finished";
    res.send(resp.message);
  } catch (e: any) {
    const err = e as Error;

    resp.message = "something error -- " + err.message;
    res.send(resp);
  }
};
