import ChatIcon from '/modules/@heroicons/vue/outline/ChatIcon.js'
import DotsHorizontalIcon from '/modules/@heroicons/vue/outline/DotsHorizontalIcon.js'
import ViewGridIcon from '/modules/@heroicons/vue/outline/ViewGridIcon.js'
import BadgeCheckIcon from '/modules/@heroicons/vue/solid/BadgeCheckIcon.js'
import CheckIcon from '/modules/@heroicons/vue/solid/CheckIcon.js'
import UserIcon from '/modules/@heroicons/vue/solid/UserIcon.js'
import { useRoute, useRouter } from '/modules/vue-router.js'
import { onBeforeMount, ref, watch } from '/modules/vue.js'
import api from '/src/api/api.js'
import DeleteFriendDialog from '/src/components/profile/DeleteFriendDialog.js'
import FriendsDialog from '/src/components/profile/FriendsDialog.js'
import Button from '/src/components/ui/Button.js'
import CommentSolid from '/src/icons/CommentSolid.js'
import PostsIcon from '/src/icons/PostsIcon.js'
import { invite } from '/src/store/chatStore.js'
import { isAuthenticated, user as currentUser } from '/src/store/userStore.js'
export default {
  template: `  
  	<DeleteFriendDialog
  		:isOpen="removeFriendDialogOpen"
  		@deleteFriend="removeFriend()"
  		@modalClosed="removeFriendDialogOpen = false"
  		:username="user.username"
  		:imageURL="user.imageURL"
  	/>
  	<FriendsDialog 
  		:isOpen="isFriendsDialogOpen"
  		:username="user.username"
  		:mutuals="mutualsVisible"
  		@modalClosed="isFriendsDialogOpen = false"
  	/>
  	<div class="flex flex-col items-center overflow-y-auto">
  		<div class="max-w-4xl w-full">
  			<div id="profile-info" class="flex py-10 justify-center space-x-20 border-b border-gray-300">
  				<div class="relative sm:w-1/4 w-1/3 flex justify-end">
  					<img
  						:src="user.imageURL"
  						alt="Profile picture"
  						class="object-cover md:w-40 md:h-40 sm:w-24 sm:h-24 w-14 h-14 border border-gray-300 rounded-full -mr-5"
  					/>
  				</div>
  				<div id="profile-details" class="flex flex-col space-y-3 flex-1">
  					<div class="flex space-x-2 items-center">
  						<p class="text-2xl text-gray-900 font-light tracking-normal">{{ user.username }}</p>
  						<div v-if="user.isAdmin" class="flex items-center justify-center mt-1 space-x-1">
  							<BadgeCheckIcon class="text-blue-500 w-5 h-5 "/>
  							<div class="text-blue-500 text-xs font-bold tracking-wider">ADMIN</div>
  						</div>
  						<div v-if="!isAuthenticated"></div>
  						<RouterLink v-else-if="isCurrentUser" :to="{name: 'settings'}">
  							<Button
  								class="font-medium h-[30px] !ml-4 leading-4 py-0 !text-[13.5px] !px-2 text-black border border-gray-300 whitespace-nowrap"
  							>
  								Edit Profile
  							</Button>
  						</RouterLink>
  						<Button
  							v-else-if="!user.isFriend && !friendRequestPending"
  							@click="addFriend()"
  							class="font-medium h-[30px] !ml-4 py-0 leading-4 !text-[13px] !px-3 text-white bg-black whitespace-nowrap"
  						>
  							Add Friend
  						</Button>
  						<div 
  							v-else-if="friendRequestPending && user.friendRequest.sender.id != currentUser.id"
  							class="flex items-center space-x-2 !ml-4"
  						>
  							<Button 
  								@click="acceptFriendRequest()"
  								class="font-medium h-[30px] py-0 leading-4 !text-[13.5px] !px-4 text-white bg-black whitespace-nowrap"
  							>
  								Accept
  							</Button>
  							<Button 
  								@click="declineFriendRequest()"
  								class="font-medium h-[30px] py-0 leading-4 !text-[13.5px] !px-4 text-black border border-gray-300 whitespace-nowrap"
  							>
  								Delete
  							</Button>
  						</div>
  						<Button 
  							v-else-if="friendRequestPending"
  							@click="removeFriendDialogOpen = true"
  							class="font-medium h-[30px] !ml-4 py-0 leading-4 !text-[13.5px] !px-2 text-black border border-gray-300 whitespace-nowrap"
  						>
  							Requested
  						</Button>
  						<div v-else class="flex space-x-2 !ml-4">
  							<Button
  								@click="message()"
  								class="font-medium leading-4 h-[30px] py-0 !text-[13.5px] !px-3 text-black border border-gray-300 whitespace-nowrap"
  							>
  								Message
  							</Button>
  							<Button
  								@click="removeFriendDialogOpen = true"
  								class="font-medium flex items-center text-xs h-[30px] py-0 !px-6 text-black border border-gray-300 whitespace-nowrap"
  							>
  								<UserIcon class="w-4 h-4 -ml-0.5" />
  								<CheckIcon class="w-3.5 h-3.5 text-neutral-800 -ml-1" />
  							</Button>
  						</div>
  						<Button
  							@click="ban()"
  							v-if="currentUser.isAdmin && !isCurrentUser && !user.isBanned"
  							class="font-medium leading-4 !ml-2 h-[30px] py-0 !text-[13.5px] !px-4 text-black border border-gray-300 whitespace-nowrap"
  						>
  							Ban
  						</Button>
  					</div>
  					<div>
  						<p class="font-medium">{{ user.fullName }}</p>
  						<p class="text-gray-400">{{ user.email }}</p>
  					</div>
  					<div class="flex space-x-8">
  						<div>
  							<span class="font-medium">{{ user.posts.length }}</span>
  							{{ user.posts.length == 1 ? 'post' : 'posts'}}
  						</div>
  						<div 
  							@click="showFriends()" 
  							class="cursor-pointer"
  							:class="{'cursor-text': !isCurrentUser && user.isPrivate && !user.isFriend}"
  						>
  							<span class="font-medium">{{ user.friendsCount }}</span> 
  							{{ user.friendsCount == 1 ? 'friend' : 'friends'}}
  						</div>
  						<div 
  							v-if="!isCurrentUser && (user.isFriend || !user.isPrivate)"
  							@click="showMutuals()"
  							class="cursor-pointer"
  						>
  							<span class="font-medium">{{ user.mutualsCount }}</span> 
  							{{ user.mutualsCount == 1 ? 'mutual' : 'mutuals'}}
  						</div>
  					</div>
  				</div>
  			</div>
  			<div id="posts" v-if="showPosts">
  				<div class="flex items-center border-t py-5 border-black space-x-1 w-max mx-auto">
  					<PostsIcon />
  					<span class="text-xs tracking-wider font-medium">POSTS</span>
  				</div>
  				<div class="grid grid-cols-3 md:gap-6 sm:gap-4 gap-1 pb-10">
  					<div v-for="post in user.posts" class="relative max-w-sm group text-white aspect-square">
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
    DeleteFriendDialog,
    FriendsDialog,
    PostsIcon,
    ViewGridIcon,
    UserIcon,
    ChatIcon,
    CheckIcon,
    CommentSolid,
    DotsHorizontalIcon,
    BadgeCheckIcon,
  },

  async setup() {
    onBeforeMount(
      () =>
        (document.title = `${user.value.fullName} (@${user.value.username}) • Instagram`)
    )
    const user = ref()
    const isCurrentUser = ref(false)
    const showPosts = ref(false)
    const removeFriendDialogOpen = ref(false)
    const isFriendsDialogOpen = ref(false)
    const friendRequestPending = ref(false)
    const mutualsVisible = ref(false)
    const router = useRouter()
    const route = useRoute()

    const fetchUser = async () => {
      const [data] = await api.users.get(route.params.username)

      if (data) {
        user.value = data
        isCurrentUser.value = user.value.username === currentUser.username
        showPosts.value =
          isCurrentUser.value || user.value.isFriend || !user.value.isPrivate
        friendRequestPending.value = user.value.friendRequest?.isPending
      }
    }

    const addFriend = async () => {
      const [data] = await api.users.addFriend(user.value.username)
      data && (await fetchUser())
    }

    const removeFriend = async () => {
      await api.users.removeFriend(user.value.username)
      await fetchUser()
    }

    const acceptFriendRequest = async () => {
      const [data] = await api.users.acceptFriendRequest(
        user.value.friendRequest.id
      )
      data && (await fetchUser())
    }

    const declineFriendRequest = async () => {
      const [data] = await api.users.declineFriendRequest(
        user.value.friendRequest.id
      )
      data && (await fetchUser())
    }

    const ban = async () => {
      await api.users.ban(user.value.username)
      user.value.isBanned = true
    }

    const message = async () => {
      const conversation = await invite(user.value.username)

      if (conversation) {
        router.push({
          name: 'direct-thread',
          params: {
            id: conversation.id,
          },
        })
      }
    }

    const showFriends = () => {
      if (!isCurrentUser && user.value.isPrivate && !user.value.isFriend) return
      mutualsVisible.value = false
      isFriendsDialogOpen.value = true
    }

    const showMutuals = () => {
      mutualsVisible.value = true
      isFriendsDialogOpen.value = true
    }

    watch(
      () => route.params.username,
      async () => route.name == 'profile' && (await fetchUser())
    )
    await fetchUser()
    return {
      user,
      isCurrentUser,
      currentUser,
      isAuthenticated,
      showPosts,
      removeFriendDialogOpen,
      isFriendsDialogOpen,
      friendRequestPending,
      removeFriend,
      addFriend,
      ban,
      message,
      acceptFriendRequest,
      declineFriendRequest,
      showFriends,
      showMutuals,
      mutualsVisible,
    }
  },
}
