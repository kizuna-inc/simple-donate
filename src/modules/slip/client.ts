import slipCheck from "./main";

export const slipClient = new slipCheck(
  process.env.slipKEY != undefined ? process.env.slipKEY : ""
);
