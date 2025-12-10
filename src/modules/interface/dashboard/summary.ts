export interface methodGraph {
  method: number
  count: number
}

export interface summaryGraph {
  date: Date
  amount: number
  count: number
}

export interface summaryInterface {
  widget: {
    all_time: number | undefined
    today: number | undefined
    method: methodGraph[] | undefined
  }
  graph: summaryGraph[] | undefined
}
