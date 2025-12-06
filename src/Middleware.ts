import express, { Express } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";

const corsConfig = {
  origin: [
    /^http:\/\/localhost(:[\d]+)?$/,
    /^https?:\/\/.*\.orb\.local$/,
    String(process.env.FRONT_URI),
  ],
  optionsSuccessStatus: 200,
};

let staticPath = path.resolve(__dirname, "../static");

export const Middleware = async (app: Express) => {
  app.use(cors(corsConfig));

  app.use("/static", express.static(staticPath));

  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
};
