import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const UserInfoKey = 'User-Info'

export function getToken() {
  if (Cookies.get(TokenKey)) { return Cookies.get(TokenKey) } else return null
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUserInfo() {
  const userInfo = Cookies.get(UserInfoKey)
  return userInfo ? JSON.parse(userInfo) : {}
}

export function setUserInfo(user) {
  return Cookies.set(UserInfoKey, user)
}

export function removeUserInfo() {
  return Cookies.remove(UserInfoKey)
}
