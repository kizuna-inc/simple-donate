import {
  setupPayloadInterface,
  transactionPayloadInterface,
  uploadPayloadInterface,
} from "../interface/resp";

export class ResponsiveResp {
  status: number = 0;
  message: string = "";
  payload:
    | setupPayloadInterface
    | transactionPayloadInterface
    | uploadPayloadInterface
    | string
    | null = null;
}

export class reResp<T> {
  status: number = 0;
  message: string = "";
  payload: T | null = null;
}

export class debugResp<T, K> {
  status: number = 0;
  message: string = "";
  payload: T | null = null;
  debugPayload?: K | undefined = undefined;
}
