import { Response } from "express";

import { responseInterface } from "../../../interface/resp";

import { sQueue } from "../../queue";
import { streamTemplate } from "../../../db/mock";

export const donateTest = async (res: Response) => {
  let response: responseInterface = {
    status: 1,
    message: "ping successful :D",
    payload: null,
  };

  const testPayload = {
    username: "test",
    money: 10.0,
    message: "test donation alert!",
    template: await streamTemplate(),
  };

  await sQueue.add(
    `${process.env.ROOM_NAME || "simple-donate"}_screen`,
    testPayload
  );

  res.send(response);
};
