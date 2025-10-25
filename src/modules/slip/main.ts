// import imageType from "image-type";
// import { randomUUID } from "crypto";

import Slip2SureError from "./exception";
import { ISlip2SureBankslip } from "../interface/slip/type/bank";

export default class slipCheck {
  private readonly API_HOST: string = "https://api.slip2sure.com/api/v0";
  private readonly API_KEY: string;

  constructor(key: string) {
    this.API_KEY = key;
  }

  async bankSlip(payload: string): Promise<ISlip2SureBankslip> {
    const resp = await fetch(`${this.API_HOST}/bank/v0/verifyByPayload`, {
      method: "POST",
      body: JSON.stringify({ payload }),
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.API_KEY,
      },
    });

    const js = (await resp.json()) as ISlip2SureBankslip & {
      result: string;
      message: string;
    };

    if (resp.status !== 200) {
      throw new Slip2SureError(js.result, js.message);
    }

    return js;
  }
}
