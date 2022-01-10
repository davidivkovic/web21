import { instance } from './api.js'

const upload = async (image, caption) => {
  const formData = new FormData()
  formData.append('caption', caption)
  formData.append('image', image)

  await instance.post('/posts/upload', formData, {
    headers: { 'content-type': 'multipart/form-data' },
  })
}

export default {
  upload,
}
