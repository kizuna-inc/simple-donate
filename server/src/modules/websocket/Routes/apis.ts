import { Express, Request, Response } from "express";
import { Server } from "socket.io";

// import { donateCheck } from "./donate/check";
import { donateCheck as newDonate } from "./donate/check_upgrade";
import { donateTest } from "./donate/test";
import { upload } from "../../files/client";

export const socketAPI = async (app: Express, io: Server) => {
  app.get("/api/socket/test", async (_: Request, res: Response) =>
    donateTest(res)
  );

  app.post(
    "/api/socket/donate",
    upload.single("slip"),
    async (req: Request, res: Response) => newDonate(req, res)
  );

  // app.post("/api/socket/donate", async (req: Request, res: Response) =>
  //   donateCheck(req, res)
  // );
};
