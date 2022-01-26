import { instance, pipe, removeAccesToken, setAccesToken } from './http.js'
import router from '/src/router/index.js'
import { removeUser, setUser } from '/src/store/userStore.js'

const register = data => pipe(instance.post('/auth/register', data))

const changePassword = data =>
  pipe(instance.post('/auth/change-password', data))

const signIn = data =>
  pipe(instance.post('auth/sign-in', data), data => {
    router.go()
    setAccesToken(data.accessToken)
    setUser(data.user)
  })

const signOut = async () => {
  await instance.post('auth/sign-out', {})
  removeUser()
  removeAccesToken()
  window.location.href = '/'
}

export default {
  register,
  changePassword,
  signIn,
  signOut,
}
