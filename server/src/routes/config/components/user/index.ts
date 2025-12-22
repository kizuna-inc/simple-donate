import { Express } from "express";

import { UserRead } from "./Read";
import { UserUpdate } from "./Update";
import { BankingInterface } from "../../../../modules/interface/config/body";

export interface itemInterface {
  login: {
    username: string | undefined;
  };
  detail: {
    name: string | undefined;
    description: string | undefined;
    profileImage: string | undefined;
    backgroundImage: string | undefined;
  };
  bank: BankingInterface[];
  config: {
    order: number[] | undefined;
    minAmount: number | undefined;
  };
}

export const userConfig = async (app: Express) => {
  await UserRead(app);
  await UserUpdate(app);
};
