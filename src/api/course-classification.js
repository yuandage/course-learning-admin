import request from '@/utils/request'

// 查询课程分类
export function getClassifications(parentId) {
  return request({
    url: `/classification/parentId/${parentId}`,
    method: 'get'
  })
}

// 添加课程分类
export function addClassification(data) {
  return request({
    url: '/classification',
    method: 'post',
    data
  })
}
// 更新课程分类
export function updateClassification(id, data) {
  return request({
    url: `/classification/${id}`,
    method: 'put',
    data
  })
}

// 删除课程分类
export function deleteClassification(id) {
  return request({
    url: `/classification/${id}`,
    method: 'delete'
  })
}
