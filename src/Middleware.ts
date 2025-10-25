import { Express } from "express";
import cors from "cors";
import bodyParser from "body-parser";

const corsConfig = {
  origin: "*",
};

export const Middleware = async (app: Express) => {
  app.use(cors(corsConfig));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
};
