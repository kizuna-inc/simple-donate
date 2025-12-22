export interface streamTemplateInterface {
  id: number;
  image: string;
  sound: string;
  text: string;
}

export interface ConfigInterface {
  id: number;
  min_amount: number;
  bankOrder: number[]; // as bank id
}
