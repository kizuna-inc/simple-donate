export class responsivePayload<T> {
  status: number = 0
  message: string = ''
  payload: T | undefined = undefined
}
