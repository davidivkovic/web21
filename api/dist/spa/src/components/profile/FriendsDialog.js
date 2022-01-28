import Button from '../ui/Button.js'
import Modal from '../ui/Modal.js'
import DeleteFriendDialog from './DeleteFriendDialog.js'
import { ref, watch } from '/modules/vue.js'
import api from '/src/api/api.js'
import { isAuthenticated, user as currentUser } from '/src/store/userStore.js'
export default {
  template: `  
  <Modal 
      :isOpen="isOpen"
      light
      class="-mt-14 bg-white flex flex-col w-96 max-h-[65%] rounded overflow-hidden"
  >
      <div class="py-2 border border-b font-medium">
          {{ mutuals ? 'Mutual friends' : 'Friends' }}
      </div>
      <div class="py-2.5 overflow-y-auto">
          <div
              v-for="user in users"
              :key="user.id"
              class="select-none text-sm"
          >
              <div class="flex py-1.5 px-5 items-center justify-between">
                  <div class="flex items-center justify-center space-x-3">
                      <img :src="user.imageURL" alt="Profile picture" class="rounded-full w-8 h-8" />
                      <div class="text-left text-[13px]">
                          <RouterLink 
                              :to="'/' + user.username"
                              @click="$emit('modalClosed')"
                              class="focus-visible:outline-none"
                          >
                              <div class="font-medium focus-visible:outline-none hover:underline">
                                  {{ user.username }}
                              </div>
                          </RouterLink>
                          <div class="leading-4 text-gray-500">{{ user.fullName }}</div>
                      </div>
                  </div>
  				<div v-if="!isAuthenticated"></div>
                  <Button
                      v-else-if="user.friendRequest && user.friendRequest.isPending"
                      @click="openRemoveDialog(user)"
                      class="!text-[13px] font-medium leading-4 border border-gray-300"
                  >
                      Pending
                  </Button>
                  <Button
                      v-else-if="user.isFriend && user.id != currentUser.id"
                      @click="openRemoveDialog(user)"
                      class="!text-[13px] font-medium leading-4 border border-gray-300"
                  >
                      Remove
                  </Button>
                  <Button 
                      v-else-if="!user.isFriend && user.id != currentUser.id"
                      @click="addFriend(user)"
                      class="!text-[13px] font-medium leading-4 bg-black text-white"
                  >
                      Add Friend
                  </Button>
              </div>
          </div>
      </div>
      <DeleteFriendDialog
          v-if="selectedUser"
          :isOpen="removeFriendDialogOpen"
          @deleteFriend="removeFriend()"
          @modalClosed="removeFriendDialogOpen = false"
          :username="selectedUser.username"
          :imageURL="selectedUser.imageURL"
      />
  </Modal>
  `,
  components: {
    Modal,
    Button,
    DeleteFriendDialog,
  },
  props: ['isOpen', 'username', 'mutuals'],

  async setup(props) {
    const users = ref([])
    const selectedUser = ref()
    const removeFriendDialogOpen = ref(false)

    const openRemoveDialog = user => {
      selectedUser.value = user
      removeFriendDialogOpen.value = true
    }

    const addFriend = async user => {
      const [data] = await api.users.addFriend(user.username)

      if (data) {
        const found = users.value.find(u => u.id == user.id)
        found && (found.friendRequest = data)
      }
    }

    const removeFriend = async () => {
      const [data] = await api.users.removeFriend(selectedUser.value.username)

      if (data) {
        const user = users.value.find(u => u.id == selectedUser.value.id)

        if (user) {
          user.friendRequest = data
          user.isFriend = false
        }
      }
    }

    watch(
      () => props.isOpen,
      async () => {
        if (!props.isOpen) return
        users.value = []

        if (props.mutuals) {
          var [data] = await api.users.getMutualFriends(props.username)
        } else {
          var [data] = await api.users.getFriends(props.username)
        }

        if (data) {
          users.value = data.filter(u => u.id != currentUser.id)
          const user = data.find(u => u.id == currentUser.id)
          user && users.value.unshift(user)
        }
      }
    )
    return {
      users,
      isAuthenticated,
      currentUser,
      selectedUser,
      removeFriendDialogOpen,
      openRemoveDialog,
      addFriend,
      removeFriend,
    }
  },
}
