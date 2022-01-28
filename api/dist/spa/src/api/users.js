import { instance, pipe } from './http.js'
import { hasNotification, setUser, user } from '/src/store/userStore.js'

const get = username => pipe(instance.get(`/users/${username}`))
const hasPendingFriendRequests = () =>
  pipe(instance.get('/friend-requests/has-pending'))

if (user?.username) {
  var [data] = await get(user.username)
  if (data) setUser(data)
  var [data] = await hasPendingFriendRequests()
  if (data) hasNotification.value = data
}

const getFriends = username => pipe(instance.get(`/users/${username}/friends`))
const getMutualFriends = username =>
  pipe(instance.get(`/users/${username}/friends/mutual`))

const searchUsernameFullName = query =>
  pipe(
    instance.get('/users', {
      params: { query },
    })
  )

const addFriend = username => pipe(instance.post(`/users/${username}/add`, {}))
const removeFriend = username =>
  pipe(instance.post(`/users/${username}/remove`, {}))

const ban = username => pipe(instance.post(`/users/${username}/ban`, {}))

const getFriendRequests = () => pipe(instance.get('/friend-requests'))
const acceptFriendRequest = id =>
  pipe(instance.post(`/friend-requests/${id}/accept`, {}))
const declineFriendRequest = id =>
  pipe(instance.post(`/friend-requests/${id}/decline`, {}))

const suggestUsers = () => pipe(instance.get('/users/recommended'))

const editProfile = data => pipe(instance.post('/users/edit', data))

const search = (query, startDate, endDate, order) =>
  pipe(
    instance.get('/users/search', {
      params: { query, startDate, endDate, order },
    })
  )

export default {
  get,
  getFriends,
  getMutualFriends,
  suggestUsers,
  searchUsernameFullName,
  addFriend,
  removeFriend,
  ban,
  getFriendRequests,
  acceptFriendRequest,
  declineFriendRequest,
  hasPendingFriendRequests,
  editProfile,
  search,
}
