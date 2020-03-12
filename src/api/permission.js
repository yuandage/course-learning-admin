import request from '@/utils/request'

export function getPermissions() {
  return request({
    url: '/permission',
    method: 'get'
  })
}

export function addPermission(data) {
  return request({
    url: '/permission',
    method: 'post',
    data
  })
}

export function updatePermission(id, data) {
  return request({
    url: `/permission/${id}`,
    method: 'put',
    data
  })
}

export function deletePermission(id) {
  return request({
    url: `/permission/${id}`,
    method: 'delete'
  })
}
