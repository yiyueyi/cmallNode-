// 判断用户有没有登录
export function isLogin() {
  if (localStorage.getItem('token')) {
    return true
  }
  return false
}

// 生成token
export function setToken(token) {
  localStorage.setItem('token', token)
}

// 获取token
export function getToken() {
  return localStorage.getItem('token')
}

// 移除token
export function removeToken() {
  localStorage.removeItem('token')
}