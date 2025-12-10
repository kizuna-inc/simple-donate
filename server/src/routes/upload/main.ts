import { Express, Request, Response } from "express";
import path from "path";

import { imgUpload, upload } from "../../modules/files/client";
import { uploadProfile } from "./routes/profile";
import { uploadSlip } from "./routes/slip";

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
    "/api/upload/slip",
    upload.single("slip"),
    async (req: Request, res: Response) => uploadSlip(req, res, root)
  );
};
