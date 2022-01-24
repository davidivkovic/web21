import BadgeCheckIcon from '/modules/@heroicons/vue/solid/BadgeCheckIcon.js'
import { onBeforeMount, onBeforeUnmount } from '/modules/vue.js'
import FeedPost from '/src/components/home/FeedPost.js'
import SuggestedUser from '/src/components/home/SuggestedUser.js'
import { fetchPosts, posts, suggestedUsers } from '/src/store/feedStore.js'
import { user as currentUser } from '/src/store/userStore.js'
export default {
  template: `  
  	<div class="h-full max-w-4xl flex py-8 space-x-6 mx-auto justify-center lg:justify-start">
  		<div id="post" class="lg:w-[42rem] max-w-2xl flex-grow h-full">
  				<div v-if="posts.length > 0" class="pb-8 space-y-5">
  					<FeedPost v-for="post in posts" :post="post"/>
  				</div>
  				<div v-else class="text-center h-full flex flex-col justify-center">
  					Your feed is empty
  					<div class="text-[13px] text-gray-400">
  						Please check back at a later time.
  					</div>
  				</div>
  		</div>
  		<div class="basis-72 lg:flex hidden mt-5">
  			<div style="min-width: inherit;" class="fixed w-[18rem] text-[13px]">
  				<RouterLink
  					:to="'/' + currentUser.username"
  					class="relative flex items-center space-x-4"
  				>
  					<img
  						:src="currentUser.imageURL"
  						alt="Profile picture"
  						class="object-cover w-14 h-14 rounded-full border-gray-300"
  					/>
  					<div>
  						<div class="flex space-x-1 items-center">
  							<div class="font-medium">{{ currentUser.username }}</div>
  							<BadgeCheckIcon v-if="currentUser.isAdmin" class="text-blue-400 w-4 h-4"/>
  						</div>
  						<div class="text-gray-500">{{ currentUser.fullName }}</div>
  					</div>
  				</RouterLink>
  				<div class="text-gray-500 text-sm mt-5 font-medium">Suggestions for you</div>
  				<div class="space-y-3 mt-4">
  					<div v-for="user in suggestedUsers">
  						<SuggestedUser :user="user" />
  					</div>
  				</div>
  			</div>
  		</div>
  	</div>
  `,
  name: 'home',
  components: {
    FeedPost,
    SuggestedUser,
    BadgeCheckIcon,
  },

  async setup() {
    const onScroll = ({
      target: { scrollTop, clientHeight, scrollHeight },
    }) => {
      if (scrollTop + clientHeight + 100 >= scrollHeight) {
        fetchPosts(false)
      }
    }

    onBeforeMount(() => {
      document.title = 'Instagram'
      document.getElementById('shell').addEventListener('scroll', onScroll)
    })
    onBeforeUnmount(() => {
      document.getElementById('shell').removeEventListener('scroll', onScroll)
    })
    await fetchPosts(true)
    return {
      posts,
      suggestedUsers,
      currentUser,
      onScroll,
    }
  },
}
