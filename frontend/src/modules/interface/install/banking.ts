export interface BankingInterface {
  id?: number | undefined
  name: string | null
  no: string | null
  type: number | null
  bank?: string | undefined
}

export interface noBankingInterface {
  name: string
  no: string
  type: number
  bank?: string
}
