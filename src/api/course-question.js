import request from '@/utils/request'

// 查询课程章节
export function getQuestion(courseId) {
  return request({
    url: `/question/courseId/${courseId}`,
    method: 'get'
  })
}
// 添加章节
export function addQuestion(data) {
  return request({
    url: '/question',
    method: 'post',
    data
  })
}
// 更新章节
export function updateQuestion(id, data) {
  return request({
    url: `/question/${id}`,
    method: 'put',
    data
  })
}

// 删除课程章节
export function deleteQuestion(id) {
  return request({
    url: `/question/${id}`,
    method: 'delete'
  })
}
