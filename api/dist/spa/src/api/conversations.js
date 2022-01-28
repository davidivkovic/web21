import { instance, pipe } from './http.js'

const get = () => pipe(instance.get('/conversations'))
const getById = id => pipe(instance.get('/conversations/' + id))
const invite = username =>
  pipe(instance.post('/conversations/invite/' + username, {}))
const unreadCount = () => pipe(instance.get('/conversations/unread-count'))
const messagesBefore = (conversationId, before) =>
  pipe(
    instance.get(`/conversations/${conversationId}/messages?before=${before}`)
  )

export default {
  get,
  getById,
  invite,
  messagesBefore,
  unreadCount,
}
