import type { responseInterface } from '../interface/responseInterface'

export const isConfig = async (isSet: boolean) => {
  const check = (await (
    await fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/config/isset`)
  ).json()) as responseInterface<null>

  let state = isSet ? check.status !== 1 : check.status !== 0

  if (state) {
    window.location.replace(isSet ? '/install' : '/')
  }

  return !state
}
