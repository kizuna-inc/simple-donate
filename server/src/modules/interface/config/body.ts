export interface UserLoginInterface {
  username: string;
  password: string;
}

export interface DetailInterface {
  name: string;
  description: string;
  profileImage: string;
  backgroundImage: string;
}

export interface BankingInterface {
  name: string;
  no: string;
  type: number;
  bank?: string | undefined;
}

export interface BodyInterface {
  user: UserLoginInterface;
  detailed: DetailInterface;
  banking: BankingInterface;
}
