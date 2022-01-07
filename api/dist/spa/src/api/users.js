import { instance, pipe } from './api.js'

const get = id => pipe(instance.get(`/users/${id}`))

export default {
  get,
}
