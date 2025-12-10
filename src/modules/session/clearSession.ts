export const logOut = () => {
  window.sessionStorage.clear()
  window.location.replace('/')
}
