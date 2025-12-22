import type { BankingInterface } from './banking'
import type { DetailedInterface } from './detailed'
import type { UserInterface } from './user'

export interface OverviewInterface {
  user: UserInterface | null
  detailed: DetailedInterface | null
  banking: BankingInterface | BankingInterface[] | null
  min_amount: number | undefined
}
