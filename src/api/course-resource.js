import request from '@/utils/request'

// 查询课程章节
export function getResource(courseId) {
  return request({
    url: `/resource/courseId/${courseId}`,
    method: 'get'
  })
}
// 添加章节
export function addResource(data) {
  return request({
    url: '/resource',
    method: 'post',
    data
  })
}
// 更新章节
export function updateResource(id, data) {
  return request({
    url: `/resource/${id}`,
    method: 'put',
    data
  })
}

// 删除课程章节
export function deleteResource(id) {
  return request({
    url: `/resource/${id}`,
    method: 'delete'
  })
}

export function uploadResource(data) {
  return request({
    url: '/resource/resourceUpload',
    method: 'post',
    data
  })
}
