import request from '@/utils/request'

export function getComment(courseId) {
  return request({
    url: `/comment/courseId/${courseId}`,
    method: 'get'
  })
}

export function deleteComment(id) {
  return request({
    url: `/comment/${id}`,
    method: 'delete'
  })
}
