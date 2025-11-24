import { BankRespInterface } from "../interface/config/resp";
import { verifyPayload } from "../interface/payload";

export const bankChecker = (config: BankRespInterface, slip: verifyPayload) => {
  console.log(config);
  console.log(slip);

  if (config.name !== slip.receiver.name) {
    return false;
  }

  if (slip.receiver.value.length != config.no.length) {
    return false;
  }

  // Parsing Receiver ID
  const newReceiverID = slip.receiver.value.replaceAll("-", "").slice(-4);

  // BankID
  const newBankID = config.no.slice(-4);

  if (newBankID !== newReceiverID) {
    return false;
  }

  return true;
};
