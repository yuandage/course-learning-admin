import request from '@/utils/request'

export function getVideo(courseId) {
  return request({
    url: `/video/courseId/${courseId}`,
    method: 'get'
  })
}

export function addVideo(data) {
  return request({
    url: '/video',
    method: 'post',
    data
  })
}

export function updateVideo(id, data) {
  return request({
    url: `/video/${id}`,
    method: 'put',
    data
  })
}

export function deleteVideo(id) {
  return request({
    url: `/video/${id}`,
    method: 'delete'
  })
}

export function uploadVideo(data) {
  return request({
    url: '/video/videoUpload',
    method: 'post',
    data
  })
}
