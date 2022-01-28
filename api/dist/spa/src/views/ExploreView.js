import { onBeforeMount, onBeforeUnmount } from '/modules/vue.js'
import CommentSolid from '/src/icons/CommentSolid.js'
import { fetchPosts, posts } from '/src/store/feedStore.js'
export default {
  template: `  
  <div class="h-full max-w-4xl flex py-8 space-x-6 mx-auto justify-center lg:justify-start">
      <div id="posts">
          <div class="grid grid-cols-3 md:gap-6 sm:gap-4 gap-1 pb-10">
              <div v-for="post in posts" class="relative max-w-sm group text-white aspect-square">
                  <RouterLink :to="{ name: 'post', params: { id: post.id } }">
                      <img :src="post.imageURL" class="object-cover h-full w-full" />
                      <div class="absolute bg-black opacity-20 w-full h-full top-0 hidden group-hover:block" />
                      <div
                          class="absolute top-0 hidden group-hover:flex w-full h-full items-center justify-center space-x-2"
                      >
                          <CommentSolid class="w-5 h-5 text-white" />
                          <span>{{ post.commentCount }}</span>
                      </div>
                  </RouterLink>
              </div>
          </div>
      </div>
  </div>
  `,
  name: 'home',
  components: {
    CommentSolid,
  },

  async setup() {
    const onScroll = ({
      target: { scrollTop, clientHeight, scrollHeight },
    }) => {
      if (scrollTop + clientHeight + 100 >= scrollHeight) {
        fetchPosts(false, true)
      }
    }

    onBeforeMount(() => {
      document.title = 'Instagram'
      document.getElementById('shell').addEventListener('scroll', onScroll)
    })
    onBeforeUnmount(() => {
      document.getElementById('shell').removeEventListener('scroll', onScroll)
    })
    await fetchPosts(true, true)
    return {
      posts,
      onScroll,
    }
  },
}
