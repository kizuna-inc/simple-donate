import { Express, Request, Response } from "express";
import path from "path";

import { imgUpload, overlayUpload, upload } from "../../modules/files/client";
import { fullUpdate, uploadProfile } from "./routes/profile";
import { uploadSlip } from "./routes/slip";
import { imageUpdate, soundUpdate } from "./routes/overlay";

export const uploadRoutes = async (app: Express) => {
  const root = path.resolve(
    __dirname,
    process.env.MODE === "PROD" ? "../../../../" : "../../../"
  );

  app.post(
    "/api/upload/image",
    imgUpload.single("image"),
    async (req: Request, res: Response) => uploadProfile(req, res, root)
  );

  app.post(
    "/api/upload/image/update",
    imgUpload.fields([
      { name: "profile", maxCount: 1 },
      { name: "background", maxCount: 1 },
    ]),
    async (req: Request, res: Response) => fullUpdate(req, res, root)
  );

  app.post(
    "/api/upload/slip",
    upload.single("slip"),
    async (req: Request, res: Response) => uploadSlip(req, res, root)
  );

  app.post(
    "/api/config/overlay/update/image",
    overlayUpload.single("file"),
    async (req: Request, res: Response) => imageUpdate(req, res, root)
  );

  app.post(
    "/api/config/overlay/update/sound",
    overlayUpload.single("file"),
    async (req: Request, res: Response) => soundUpdate(req, res, root)
  );
};
