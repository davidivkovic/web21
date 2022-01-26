import { instance, pipe } from './http.js'

const get = async id => pipe(instance.get('/posts/' + id))

const upload = async (image, caption) => {
  const formData = new FormData()
  formData.append('caption', caption)
  formData.append('image', image)

  try {
    const response = await instance.post('/posts/upload', formData, {
      headers: { 'content-type': 'multipart/form-data' },
    })

    return [response.data, null]
  } catch (error) {
    return [null, error.response.data]
  }
}

const deletePost = (postId, reason = '') =>
  pipe(instance.post(`/posts/${postId}/delete`, reason))

const comment = (postId, content) =>
  pipe(instance.post(`/posts/${postId}/comments/add`, content))
const deleteComment = (postId, commentId) =>
  pipe(instance.delete(`/posts/${postId}/comments/${commentId}/delete`))

const setAsProfilePicture = postId =>
  pipe(instance.post(`/posts/${postId}/set-as-pfp`, {}))

const feed = (before = '') => pipe(instance.get('posts/feed?before=' + before))
const explore = (before = '') =>
  pipe(instance.get('posts/explore?before=' + before))

export default {
  get,
  upload,
  comment,
  deleteComment,
  setAsProfilePicture,
  deletePost,
  feed,
  explore,
}
