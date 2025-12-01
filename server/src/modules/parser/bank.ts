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

  // ReceiverID
  const newReceiverID = ReceiverID.slice(-4);

  // BankID
  const newBankID = config.no.slice(-4);

  if (newBankID !== newReceiverID) {
    return false;
  }

  return true;
};
