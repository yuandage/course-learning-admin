import request from '@/utils/request'

// 查询课程章节
export function getChapter(courseId, parentId) {
  return request({
    url: `/chapter/${courseId}/${parentId}`,
    method: 'get'
  })
}
// 添加章节
export function addChapter(data) {
  return request({
    url: '/chapter',
    method: 'post',
    data
  })
}
// 更新章节
export function updateChapter(id, data) {
  return request({
    url: `/chapter/${id}`,
    method: 'put',
    data
  })
}

// 删除课程章节
export function deleteChapter(id) {
  return request({
    url: `/chapter/${id}`,
    method: 'delete'
  })
}
