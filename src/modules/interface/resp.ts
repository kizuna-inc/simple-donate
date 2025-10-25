export interface responseInterface {
  status: number;
  message: string;
  payload: userPayloadInterface | transactionPayloadInterface | null;
}

export interface userPayloadInterface {
  id: number;
  name: string;
  email: string;
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
