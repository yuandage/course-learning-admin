import request from '@/utils/request'

export function getUserRoles(id) {
  return request({
    url: `/userRole/userId/${id}`,
    method: 'get'
  })
}

export function addUserRole(data) {
  return request({
    url: '/userRole/',
    method: 'post',
    data
  })
}

export function deleteUserRole(userId, roleId) {
  return request({
    url: `/userRole/${userId}/${roleId}`,
    method: 'delete'
  })
}
