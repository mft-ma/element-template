import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'http://localhost:7001/load',
    method: 'get',
    params:{...data}
  })
}

export function getInfo(token) {
  return request({
    url: 'http://localhost:7001/getUserInfo',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
