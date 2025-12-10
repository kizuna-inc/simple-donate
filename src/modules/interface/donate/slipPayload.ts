export interface slipInterface {
  payload: string
  transRef: string
  amount: number
  transDateTime: string
  receiver: {
    name: string
    type: 'NATID' | 'MSISDN' | 'EWALLETID' | 'BILLERID'
    value: string
  }
}
