import { Express } from "express";
import { overlayRead } from "./Read";
import { overlayUpdate } from "./Update";

export const templateConfig = async (app: Express) => {
  await overlayRead(app);
  await overlayUpdate(app);
};
