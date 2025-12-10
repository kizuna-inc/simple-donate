import type { slipInterface } from '@/modules/interface/donate/slipPayload'

export class DonatePayloadClass {
  name: string | null = null
  message: string | null = null
  amount: number = 0
  method: number = 0
  slip: slipInterface | null = null
  token: string | null = null
}
