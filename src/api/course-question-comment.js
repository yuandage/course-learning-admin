import request from '@/utils/request'

export function getComment(courseId) {
  return request({
    url: `/questionComment/courseId/${courseId}`,
    method: 'get'
  })
}

export function deleteComment(id) {
  return request({
    url: `/questionComment/${id}`,
    method: 'delete'
  })
}
