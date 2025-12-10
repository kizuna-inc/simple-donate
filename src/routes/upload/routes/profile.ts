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
