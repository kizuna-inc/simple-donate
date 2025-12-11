import { receiveMessageOnPort } from "node:worker_threads";
import { BankRespInterface } from "../interface/config/resp";
import { verifyPayload } from "../interface/payload";

export const bankChecker = (config: BankRespInterface, slip: verifyPayload) => {
  if (config.name !== slip.receiver.name) {
    return false;
  }

  // Parsing Receiver ID
  const ReceiverID = slip.receiver.value.replaceAll("-", "");

  if (ReceiverID.length != config.no.length) {
    console.log("nonono");

    return false;
  }

  let newConfig = "";

  if (/[0-9]+x+/i.test(ReceiverID)) {
    newConfig = `${ReceiverID.replaceAll("x", "")}${Array.from({
      length: ReceiverID.split("x").length - 1,
    })
      .fill("x")
      .join("")}`;
  }

  if (/x+[0-9]+/i.test(ReceiverID)) {
    newConfig = `${Array.from({ length: ReceiverID.split("x").length - 1 })
      .fill("x")
      .join("")}${ReceiverID.replaceAll("x", "")}`;
  }

  if (ReceiverID !== newConfig) {
    return false;
  }

  return true;
};
