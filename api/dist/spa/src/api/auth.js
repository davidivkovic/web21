import { instance, pipe, setAccesToken } from './api.js'
import router from '/src/router/index.js'
import { removeUser, setUser } from '/src/store/userStore.js'

const register = data => pipe(instance.post('/auth/register', data))

const signIn = data =>
  pipe(instance.post('auth/sign-in', data), data => {
    console.log(data)
    router.go()
    setAccesToken(data.accessToken)
    setUser(data.user)
  })

const signOut = async () => {
  // await instance.post('auth/sign-out')
  removeUser()
}

export default {
  register,
  signIn,
  signOut,
}
