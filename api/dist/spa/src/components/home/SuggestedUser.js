import { computed, ref } from '/modules/vue.js'
import api from '/src/api/api.js'
import DeleteFriendDialog from '/src/components/profile/DeleteFriendDialog.js'
import SpinIcon from '/src/icons/SpinIcon.js'
export default {
  template: `  
  	<div class="flex justify-between items-start">
  		<div class="flex space-x-3 items-center">
  			<RouterLink :to="{ name: 'profile', params: { username: user.username } }">
  				<img :src="user.imageURL" alt="Profile picture" class="w-8 h-8 rounded-full object-cover" />
  			</RouterLink>
  			<div>
  				<RouterLink :to="{ name: 'profile', params: { username: user.username } }">
  					<div class="font-medium hover:underline">{{ user.username }}</div>
  				</RouterLink>
  				<div class="text-neutral-500 text-[11.5px]">
  					<span v-if="user.isSuggestion">
  						{{ user.mutualsCount }}
  						{{ user.mutualsCount  == 1 ? 'Mutual friend' : 'Mutual friends' }}
  					</span>
  					<span v-else>
  						Friends with {{ user.mutualsCount }} {{ user.mutualsCount == 1 ? 'other person' : 'other people' }}
  					</span>
  				</div>
  			</div>
  		</div>
  		<button v-if="!added" @click="addFriend()" class="text-blue-400 font-medium w-20">
  			<span v-if="!isLoading" class="text-xs tracking-tight">Add Friend</span>
  			<SpinIcon v-else class="w-full text-blue-400" />
  		</button>
  		<button v-else @click="openDialog()" class="text-gray-900 font-medium w-20">
  			<span v-if="!isLoading" class="text-xs">Pending</span>
  			<SpinIcon v-else class="w-full text-black" />
  		</button>
  	</div>
  	<DeleteFriendDialog
  		:isOpen="isDialogOpen"
  		@modalClosed="closeDialog()"
  		@deleteFriend="deleteFriendRequest"
  		:username="user.username"
  		:imageURL="user.imageURL"
  	/>
  `,
  props: ['user'],
  components: {
    SpinIcon,
    DeleteFriendDialog,
  },

  async setup(props) {
    const isLoading = ref(false)
    const isDialogOpen = ref(false)
    const added = computed(() => {
      return props.user.friendRequest && props.user.friendRequest.isPending
    })

    const addFriend = async () => {
      isLoading.value = true
      await api.users.addFriend(props.user.username)
      setTimeout(() => {
        isLoading.value = false
        props.user.friendRequest = {
          isPending: true,
        }
      }, 300)
    }

    const deleteFriendRequest = async () => {
      isLoading.value = true
      await api.users.removeFriend(props.user.username)
      setTimeout(() => {
        isLoading.value = false
        props.user.friendRequest.isPending = false
      }, 300)
    }

    const openDialog = () => {
      isDialogOpen.value = true
    }

    const closeDialog = () => {
      isDialogOpen.value = false
    }

    return {
      isLoading,
      added,
      addFriend,
      isDialogOpen,
      closeDialog,
      openDialog,
      deleteFriendRequest,
    }
  },
}
