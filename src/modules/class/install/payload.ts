import type { DetailedInterface } from '@/modules/interface/install/detailed'
import type { UserInterface } from '@/modules/interface/install/user'
import type { BankingClass } from './banking'

export class PayloadClass {
  user: UserInterface | null = null

  detailed: DetailedInterface | null = null

  banking: BankingClass | null = null
}
