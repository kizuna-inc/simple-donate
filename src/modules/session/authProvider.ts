const tokenCheck = async (token: string) => {
  const checkFetch = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/auth/status`, {
    method: 'get',
    headers: new Headers({
      authorization: `Bearer ${token}`,
    }),
  })
  if (!checkFetch.ok) {
    return false
  }

  const checkData = await checkFetch.json()
  if (checkData.status !== 1) {
    return false
  }

  return true
}

export const isLogin = async () => {
  const token = window.sessionStorage.getItem('token')

  if (token === undefined || token === null || token === '') {
    return false
  }

  const tokenState = await tokenCheck(token)

  return tokenState
}
