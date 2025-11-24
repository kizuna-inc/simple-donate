import { Express, Request, Response } from "express";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";

import { client } from "../../modules/db/client";
import { ResponsiveResp } from "../../modules/response/main";
import {
  BankingPayload,
  ConfigPayload,
  DetailPayload,
  UserPayload,
} from "../../modules/response/db.payload";

export const setUpRoutes = async (app: Express) => {
  app.get("/api/config/isset", async (req: Request, res: Response) => {
    const config = await client.userConfig.count();

    let resp = new ResponsiveResp();

    if (config > 0) {
      resp.status = 1;
      resp.message = "Config is already set";
    } else {
      resp.message = "Config isn't set properly..";
    }

    res.send(resp);
  });

  app.post("/api/config/start", async (req: Request, res: Response) => {
    let resp = new ResponsiveResp();

    console.log(req.body);

    if (req.body === undefined) {
      resp.message = "blank body..";
      res.send(resp);
      return;
    }

    const payloadBased = new ConfigPayload();

    const { username, password } = req.body;

    // ## Checking State ##
    // ### User Handling ###
    // Username
    if (username === undefined || username === null || username === "") {
      resp.message = "Some form(s) still blank.. Please try again..";
      console.log("username blank..");

      res.send(resp);
      return;
    }

    // Password
    if (password === undefined || password === null || password === "") {
      resp.message = "Some form(s) still blank.. Please try again..";
      console.log("password blank..");

      res.send(resp);
      return;
    }

    // User Part Conclusion
    let salt = await bcrypt.genSalt(10);

    const user = new UserPayload();
    user.username = username;
    user.password = await bcrypt.hash(password, salt);

    // ### Detail Handling ###
    const { name, description, profileImage, backgroundImage } = req.body;
    const staticPath = path.resolve(__dirname, `../../../`);

    // Name
    if (name === undefined || name === null || name === "") {
      resp.message = "Some form(s) still blank.. Please try again..";
      console.log("name blank..");

      res.send(resp);
      return;
    }

    // Description
    if (
      description === undefined ||
      description === null ||
      description === ""
    ) {
      resp.message = "Some form(s) still blank.. Please try again..";
      console.log("description blank..");

      res.send(resp);
      return;
    }

    if (
      profileImage === undefined ||
      profileImage === null ||
      profileImage === ""
    ) {
      // Profile Image --> File check
      resp.message = "Some form(s) still blank.. Please try again..";
      console.log("profile image blank..");

      res.send(resp);
      return;
    }

    if (!fs.existsSync(path.join(staticPath, profileImage))) {
      resp.message = "profile image file's not there... try again :(";

      res.send(resp);
      return;
    }

    // Background Image --> File check again
    if (
      backgroundImage === undefined ||
      backgroundImage === null ||
      backgroundImage === ""
    ) {
      resp.message = "Some form(s) still blank.. Please try again..";
      console.log("background image blank..");

      res.send(resp);
      return;
    }

    if (!fs.existsSync(path.join(staticPath, backgroundImage))) {
      resp.message = "background image file's not there... try again :(";

      res.send(resp);
      return;
    }

    // Detail Part Conclusion
    const detailed = new DetailPayload();
    detailed.name = name;
    detailed.description = description;
    detailed.profileImage = profileImage;
    detailed.backgroundImage = backgroundImage;

    // ### Banking Part ###
    const { account_name, account_no, account_type, account_bank } = req.body;
    const banking = new BankingPayload();

    // Checking State
    // Account Name
    if (
      account_name === undefined ||
      account_name === null ||
      account_name === ""
    ) {
      resp.message = "Some form(s) still blank.. Please try again..";
      console.log("account name blank..");

      res.send(resp);
      return;
    }

    // Account Number
    if (account_no === undefined || account_no === null || account_no === "") {
      resp.message = "Some form(s) still blank.. Please try again..";
      console.log("account no blank..");

      res.send(resp);
      return;
    }

    // Account type
    if (
      account_type === undefined ||
      account_type === null ||
      account_type === "" ||
      account_type === 404
    ) {
      resp.message = "Some form(s) still blank.. Please try again..";
      console.log("account type blank..");

      res.send(resp);
      return;
    }

    if (account_type === 1) {
      if (
        account_bank === undefined ||
        account_bank === null ||
        account_bank === ""
      ) {
        resp.message = "Some form(s) still blank.. Please try again..";
        console.log("account bank blank..");

        res.send(resp);
        return;
      }

      banking.bank = account_bank;
    }

    // Banking Conclusion
    banking.name = account_name;
    banking.no = account_no;
    banking.type = account_type;

    // [Later] ### Color Config ###

    // ## FINAL PAYLOAD ##
    payloadBased.user = user;
    payloadBased.detailed = detailed;
    payloadBased.banking = banking;

    // ## Added to DB ##
    const userCreate = await client.user.create({
      data: {
        username: payloadBased.user.username,
        password: payloadBased.user.password,
      },
    });

    const configCreate = await client.userConfig.create({
      data: {
        name: payloadBased.detailed.name,
        description: payloadBased.detailed.description,
        profileImage: payloadBased.detailed.profileImage,
        backgroundImage: payloadBased.detailed.backgroundImage,

        user_id: userCreate.id,
      },
    });

    const bankingCreate = await client.bankingConfig.create({
      data: {
        name: payloadBased.banking.name,
        type: Number(payloadBased.banking.type),
        no: payloadBased.banking.no,
        bank:
          payloadBased.banking.bank !== undefined
            ? payloadBased.banking.bank
            : "",

        user_id: userCreate.id,
      },
    });

    let newData = {
      user: userCreate,
      detail: configCreate,
      banking: bankingCreate,
    };

    resp.message = "Set up user successfully!";
    resp.status = 1;
    resp.payload = newData;

    res.send(resp);
  });
};
