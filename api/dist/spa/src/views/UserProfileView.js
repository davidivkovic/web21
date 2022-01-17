import ChatIcon from '/modules/@heroicons/vue/outline/ChatIcon.js'
import DotsHorizontalIcon from '/modules/@heroicons/vue/outline/DotsHorizontalIcon.js'
import UserRemoveIcon from '/modules/@heroicons/vue/outline/UserRemoveIcon.js'
import ViewGridIcon from '/modules/@heroicons/vue/outline/ViewGridIcon.js'
import { useRoute } from '/modules/vue-router.js'
import { ref } from '/modules/vue.js'
import api from '/src/api/api.js'
import Button from '/src/components/ui/Button.js'
import CommentSolid from '/src/icons/CommentSolid.js'
import PostsIcon from '/src/icons/PostsIcon.js'
export default {
  template: `  
  	<div class="flex flex-col items-center">
  		<div class="max-w-4xl w-full">
  			<div id="profile-info" class="flex py-10 justify-center space-x-20 border-b border-gray-300">
  				<div class="sm:w-1/4 w-1/3 flex justify-end">
  					<img
  						:src="user.imageURL"
  						alt="Profile picture"
  						class="md:w-40 md:h-40 sm:w-24 sm:h-24 w-14 h-14 border border-gray-300 rounded-full -mr-5"
  					/>
  				</div>
  				<div id="profile-details" class="flex flex-col space-y-3 flex-1">
  					<div class="flex space-x-2">
  						<p class="text-2xl text-gray-900 font-light tracking-normal pr-4">{{ user.username }}</p>
  						<Button
  							@click="editProfile()"
  							v-if="isLoggedInProfile"
  							class="font-medium text-xs px-5 text-black bg-white border border-gray-300 whitespace-nowrap"
  						>Edit Profile</Button>
  						<Button
  							@click="addFriend()"
  							v-else-if="!isFriend"
  							class="font-medium text-xs px-5 text-white bg-black border border-gray-300 whitespace-nowrap"
  						>Add Friend</Button>
  						<div v-else class="flex space-x-2">
  							<Button
  								class="font-medium text-xs px-5 text-black bg-white border border-gray-300 whitespace-nowrap"
  							>Message</Button>
  							<Button
  								@click="unfollow()"
  								class="font-medium text-xs px-5 text-black bg-white border border-gray-300 whitespace-nowrap"
  							>
  								<UserRemoveIcon class="w-4 h-4" />
  							</Button>
  						</div>
  						<Button
  							@click="ban()"
  							v-if="user.isAdmin && !isLoggedInProfile"
  							class="font-medium text-xs px-5 text-black bg-white border border-gray-300 whitespace-nowrap"
  						>Ban</Button>
  					</div>
  					<div>
  						<p class="font-medium">{{ user.fullName }}</p>
  						<p class="text-gray-400">{{ user.email }}</p>
  					</div>
  					<div class="flex space-x-8">
  						<div>
  							<span class="font-medium">{{ user.posts.length }}</span>
  							posts
  						</div>
  						<div>
  							<span class="font-medium">{{ user.friendsCount }}</span> friends
  						</div>
  						<div v-if="!isLoggedInProfile">
  							<span class="font-medium">{{ user.mutualsCount }}</span> mutuals
  						</div>
  					</div>
  				</div>
  				<div class="bg-red-600"></div>
  			</div>
  			<div id="posts" v-if="showPosts">
  				<div class="flex items-center border-t py-5 border-black space-x-1 w-max mx-auto">
  					<PostsIcon />
  					<span class="text-xs tracking-wider font-medium">POSTS</span>
  				</div>
  				<div class="grid grid-cols-3 md:gap-8 sm:gap-4 gap-1 pb-10">
  					<div v-for="post in user.posts" class="relative max-w-sm group text-white">
  						<RouterLink :to="{ name: 'post', params: { id: post.id } }">
  							<img :src="post.imageURL" class="object-cover" />
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
  			<div v-else class="bg-white text-center py-14 text-[13px]">
  				<div class="w-1/4 mx-auto">
  					<p class="font-medium">This account is private</p>
  					<p class="mt-5">Follow to see their photos and videos.</p>
  				</div>
  			</div>
  		</div>
  	</div>
  `,
  name: 'user-profile',
  components: {
    Button,
    PostsIcon,
    ViewGridIcon,
    UserRemoveIcon,
    ChatIcon,
    CommentSolid,
    DotsHorizontalIcon,
  },

  async setup() {
    const route = useRoute()
    console.log('userp profile view')
    const [user, error] = await api.users.get(route.params.username)
    console.log(user)
    const isFriend = ref(true)
    const isLoggedInProfile = ref(true) // const isLoggedInProfile = computed(() => user.username === loggedInUser.username)

    const showPosts =
      isLoggedInProfile.value || isFriend.value || !user.isPrivate

    const unfollow = () => console.log('unfollow')

    const addFriend = () => console.log('add friend')

    const ban = () => console.log('ban')

    const editProfile = () => console.log('edit') // watch(
    // 	() => route.params.username,
    // 	newUsername => console.log(newUsername)
    // )

    return {
      user,
      isLoggedInProfile,
      isFriend,
      showPosts,
      unfollow,
      addFriend,
      ban,
      editProfile,
    }
  },
}
