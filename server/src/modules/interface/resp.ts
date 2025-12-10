import {
  BankingInterface,
  DetailInterface,
  UserLoginInterface,
} from "./config/body";

export interface responseInterface {
  status: number;
  message: string;
  payload: userPayloadInterface | transactionPayloadInterface | null;
}

export interface uploadPayloadInterface {
  path: string;
}

export interface userPayloadInterface {
  id: number;
  name: string;
  password: String;
  createdAt: Date;
}

export interface transactionPayloadInterface {
  id?: string;
  name: string;
  amount: number;
  text: string;
  transactionID: string;
  createdAt?: Date;
}

export interface setupPayloadInterface {
  user: UserLoginInterface;
  detail: DetailInterface;
  banking: BankingInterface;
}
