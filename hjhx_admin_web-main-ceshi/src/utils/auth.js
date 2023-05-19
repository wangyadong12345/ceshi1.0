// token值方法

import Cookies from 'js-cookie'

const TokenKey = 'token'
const RefreshTokenKey = 'refresh_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 刷新token
export function setRefreshToken(token) {
  return Cookies.set(RefreshTokenKey, token)
}

export function getRefreshToken() {
  return Cookies.get(RefreshTokenKey)
}

export function removeRefreshToken() {
  return Cookies.remove(RefreshTokenKey)
}

export function removeCookie() {
  removeToken()
  removeRefreshToken()
}
