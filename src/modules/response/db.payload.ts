import {
  BankingInterface,
  DetailInterface,
  UserLoginInterface,
} from "../interface/config/body";

export class ConfigPayload {
  user: UserLoginInterface | null = null;
  detailed: DetailInterface | null = null;
  banking: BankingInterface | BankingInterface[] | null = null;
}

export class UserPayload {
  username: string = "";
  password: string = "";
}

export class DetailPayload {
  name: string = "";
  description: string = "";
  profileImage: string = "";
  backgroundImage: string = "";
}

export class BankingPayload {
  name: string = "";
  no: string = "";
  type: number = 404;
  bank?: string | undefined = "";
}
