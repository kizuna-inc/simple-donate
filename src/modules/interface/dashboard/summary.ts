export interface methodGraph {
  method: number;
  count: number;
}

export interface summaryGraph {
  date: Date;
  amount: number;
  count: number;
}

export interface methodInterface {
  all_time: number | undefined;
  today: number | undefined;
}

export interface summaryInterface {
  widget: methodInterface;
}
