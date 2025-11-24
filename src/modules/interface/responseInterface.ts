export interface responseInterface<T> {
  status: number
  message: string
  payload: T | undefined | null
}
