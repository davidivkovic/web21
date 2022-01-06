import { computed, reactive } from '/modules/vue.js'

const authenticatedUser = JSON.parse(localStorage.getItem('authenticated-user'))
let user = reactive({
  // imageURL: 'https://i.pinimg.com/originals/04/e1/7a/04e17aadb6a029518f4b2a45f7053c65.png',
  // username: 'dracaa.m',
  // isAdmin: false
  ...authenticatedUser,
})

const setUser = newUser => {
  console.log(user)

  Object.assign(user, newUser)
  console.log(user)
  localStorage.setItem('authenticated-user', JSON.stringify(newUser))
}

const removeUser = () => {
  user = reactive({})
  console.log(user)
  localStorage.removeItem('authenticated-user')
}

const isAuthenticated = computed(() => Object.keys(user).length !== 0)

export { user, setUser, removeUser, isAuthenticated }
