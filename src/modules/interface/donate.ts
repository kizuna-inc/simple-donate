import { verifyPayload } from "./payload";

export interface donationPayload {
  name: string;
  message: string;
  amount: number;
  slip: verifyPayload;
}
