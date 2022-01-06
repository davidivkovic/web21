import axios from 'axios'
import auth from './auth.js'
import posts from './posts.js'
import users from './users.js'
import router from '/src/router/index.js'
import { setUser } from '/src/store/userStore.js'

const baseURL = 'http://localhost:8080/api/'

const instance = axios.create({
  baseURL,
  // withCredentials: true
})

const getAccessToken = () => localStorage.getItem('access-token')
const setAccesToken = token => localStorage.setItem('access-token', token)

instance.interceptors.request.use(request => {
  const accesToken = getAccessToken()
  if (accesToken != null) {
    request.headers['Authorization'] = 'Bearer ' + accesToken
  }
  return request
})

instance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config
    if (error.response.status !== 401 || originalRequest.isRetryAttempt) {
      return Promise.reject(error)
    }

    originalRequest.isRetryAttempt = true
    try {
      const data = await instance.get('/auth/token-refresh')
      axios.defaults.headers.common['Authorization'] =
        'Bearer ' + data.accesToken
      setAccesToken(data.accesToken)
      return instance(originalRequest)
    } catch {
      setUser({})
      router.push('/')
      return Promise.reject(error)
    }
  }
)

const pipe = async (request, onSuccess, onError) => {
  try {
    const response = await request
    onSuccess && onSuccess(response.data)
    return [response.data, null]
  } catch (error) {
    console.error(error.response)
    onError && onError(error.response.data)
    return [null, error.response.data]
  }
}

export { pipe, instance, setAccesToken }

export default {
  users,
  auth,
  posts,
}
