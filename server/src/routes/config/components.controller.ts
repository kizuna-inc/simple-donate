import { Express } from "express";
import { templateConfig } from "./components/overlay";
import { bankingConfig } from "./components/banking";
import { userConfig } from "./components/user";

export const componentsController = async (app: Express) => {
  await templateConfig(app);
  await bankingConfig(app);
  await userConfig(app);
};
