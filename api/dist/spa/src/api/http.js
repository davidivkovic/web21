import axios from '/modules/axios.js'
import router from '/src/router/index.js'
import { setUser } from '/src/store/userStore.js'

const baseURL = `http://${window.location.hostname}:8080/api/`

const instance = axios.create({
  baseURL,
  withCredentials: true,
})

const getAccessToken = () => localStorage.getItem('access-token')
const setAccesToken = token => localStorage.setItem('access-token', token)
const removeAccesToken = () => localStorage.removeItem('access-token')

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
    if (error.response.status == 403 && error.response.data.type == 'banned') {
      setUser({})
      router.push('/')
      router.go()
      return Promise.reject(error)
    }

    const originalRequest = error.config

    if (error.response.status !== 401 || originalRequest.isRetryAttempt) {
      return Promise.reject(error)
    }

    originalRequest.isRetryAttempt = true
    try {
      const response = await instance.get('/auth/token-refresh')
      originalRequest.headers['Authorization'] =
        'Bearer ' + response.data.accessToken
      setAccesToken(response.data.accessToken)
      return instance(originalRequest)
    } catch (error) {
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
    onError && onError(error.response.data)
    return [null, error.response.data]
  }
}

export { pipe, instance, getAccessToken, setAccesToken, removeAccesToken }
