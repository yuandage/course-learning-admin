import request from '@/utils/request'

export function getRolePermissions(id) {
  return request({
    url: `/rolePermission/roleId/${id}`,
    method: 'get'
  })
}

export function addRolePermission(data) {
  return request({
    url: '/rolePermission/',
    method: 'post',
    data
  })
}

export function deleteRolePermission(roleId, permissionId) {
  return request({
    url: `/rolePermission/${roleId}/${permissionId}`,
    method: 'delete'
  })
}
