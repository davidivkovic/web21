import { isAuthenticated } from './userStore.js'
import { reactive, ref } from '/modules/vue.js'
import api from '/src/api/api.js'
const posts = ref([])
const suggestedUsers = reactive([])
const exhausted = ref(false)
const isLoading = ref(false)

const fetchPosts = async (initial, isExplore = false) => {
  if (initial && posts.value.length) return
  if (exhausted.value || isLoading.value) return
  isLoading.value = true

  if (isExplore) {
    var [data] = await api.posts.explore(
      initial ? '' : posts.value.at(-1)?.timestamp
    )
  } else {
    var [data] = await api.posts.feed(
      initial ? '' : posts.value.at(-1)?.timestamp
    )
  }

  if (data) {
    posts.value.push(...data)
    data.length == 0 && (exhausted.value = true)
  }

  isLoading.value = false
}

const newPost = post => posts.value.unshift(post)

const removePost = post =>
  (posts.value = posts.value.filter(p => p.id != post.id))

if (isAuthenticated.value) {
  const [data] = await api.users.suggestUsers()
  data && suggestedUsers.push(...data)
}

export { posts, fetchPosts, newPost, removePost, suggestedUsers }
