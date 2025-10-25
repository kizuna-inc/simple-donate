export interface payloadInterface {
  name: string;
  text: string;
  amount: number;
  verify: {
    payload: string;
    transRef: string;
    amount: number;
    transDateTime: string;
    receiver: {
      name: string;
      type: "NATID" | "MSISDN" | "EWALLETID" | "BILLERID";
      value: string;
    };
  };
}
