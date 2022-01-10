import EmojiMenu from '/src/components/emoji/EmojiMenu.js'
import FeedPost from '/src/components/home/FeedPost.js'
import { posts, users } from '/src/store/feedStore.js'
import { user as currentUser } from '/src/store/userStore.js'
export default {
  template: `  
  	<div class="relative max-w-4xl flex mx-auto py-8 space-x-6">
  		<div id="post" class="w-[70%] grow-1">
  			<div class="space-y-5">
  				<div v-for="post in posts">
  					<FeedPost :post="post"></FeedPost>
  				</div>
  			</div>
  		</div>
  		<div class="flex-1 hidden sm:block">
  			<div class="fixed text-[13px]">
  				<div class="flex items-center space-x-5">
  					<img
  						:src="currentUser.imageURL"
  						alt="Profile picture"
  						class="w-14 h-14 rounded-full border-gray-300"
  					/>
  					<div>
  						<div class="font-medium">{{ currentUser.username }}</div>
  						<div class="text-gray-400">{{ currentUser.fullName }}</div>
  					</div>
  				</div>
  				<div class="text-gray-500 text-sm mt-5 font-medium">Suggestions for you</div>
  				<div class="space-y-3 mt-3">
  					<div v-for="user in users">
  						<div class="flex justify-between items-center space-x-2">
  							<RouterLink :to="{ name: 'profile', params: { username: user.username } }">
  								<img :src="user.imageURL" alt="Profile picture" class="w-8 h-8 rounded-full" />
  							</RouterLink>
  							<div>
  								<RouterLink :to="{ name: 'profile', params: { username: user.username } }">
  									<div class="font-medium hover:underline">{{ user.username }}</div>
  								</RouterLink>
  								<div class="text-gray-400">{{ user.mutualsCount }} mutuals</div>
  							</div>
  							<button class="text-black font-medium pl-20">Add Friend</button>
  						</div>
  					</div>
  				</div>
  			</div>
  		</div>
  	</div>
  `,
  name: 'home',
  components: {
    EmojiMenu,
    FeedPost,
  },

  setup() {
    return {
      posts,
      users,
      currentUser,
    }
  },
}
