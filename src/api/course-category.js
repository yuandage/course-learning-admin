import request from '@/utils/request'

// 查询课程分类树
export function getCourseCategory() {
  return request({
    url: `/category/courseCategory`,
    method: 'get'
  })
}

// 查询课程子分类
export function getCourseSubCategory() {
  return request({
    url: `/category/subCategory`,
    method: 'get'
  })
}

// 添加课程分类
export function addCourseCategory(data) {
  return request({
    url: '/category',
    method: 'post',
    data
  })
}
// 更新课程分类
export function updateCourseCategory(id, data) {
  return request({
    url: `/category/${id}`,
    method: 'put',
    data
  })
}

// 删除课程分类
export function deleteCourseCategory(id) {
  return request({
    url: `/category/${id}`,
    method: 'delete'
  })
}
