import { Express } from "express";
import { bankingDelete } from "./Delete";
import { bankingRead } from "./Read";
import { bankingUpdate } from "./Update";
import { bankingCreate } from "./Create";

export const bankingConfig = async (app: Express) => {
  bankingCreate(app);
  bankingRead(app);
  bankingUpdate(app);
  bankingDelete(app);
};
