export interface payloadInterface {
  name: string;
  text: string;
  amount: number;
  verify: verifyPayload;
}

export interface verifyPayload {
  payload: string;
  transRef: string;
  amount: number;
  transDateTime: string;
  receiver: {
    name: string;
    type: "NATID" | "MSISDN" | "EWALLETID" | "BILLERID" | "BANKAC";
    value: string;
  };
}
