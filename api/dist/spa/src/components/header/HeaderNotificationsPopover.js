import {
  Popover,
  PopoverButton,
  PopoverPanel,
} from '/modules/headlessui-vue.js'
import { useRouter } from '/modules/vue-router.js'
import { ref } from '/modules/vue.js'
import api from '/src/api/api.js'
import AcceptedRequest from '/src/components/header/requests/AcceptedRequest.js'
import PendingRequest from '/src/components/header/requests/PendingRequest.js'
import Button from '/src/components/ui/Button.js'
import SlotWatcher from '/src/components/utility/SlotWatcher.js'
import HeartIconOutline from '/src/icons/HeartIconOutline.js'
import HeartIconSolid from '/src/icons/HeartIconSolid.js'
import { hasNotification, user } from '/src/store/userStore.js'
export default {
  template: `  
  	<Popover v-slot="{ open }" class="mt-0.5">
  		<SlotWatcher @change="fetchRequests()" :prop="open || isDialogOpen" />
  		<div class="relative">
  
  			<PopoverButton>
  				<div 
  				v-if="hasNotification"
  				class="absolute flex justify-center items-end h-full w-full"
  			>
  				<div class="-mb-0.5 w-[5px] h-[5px] bg-[#ee4957] rounded-full"></div>
  			</div>
  			<HeartIconSolid v-if="open || isDialogOpen" />
  			<HeartIconOutline v-else />
  		</PopoverButton>
  		</div>
  		<transition
  			enter-active-class="transition duration-100 ease-out"
  			enter-from-class="transform scale-95 opacity-0"
  			enter-to-class="transform scale-100 opacity-100"
  			leave-active-class="transition duration-75 ease-in"
  			leave-from-class="transform scale-100 opacity-100"
  			leave-to-class="transform scale-95 opacity-0"
  		>
  			<PopoverPanel
  				:static="isDialogOpen"
  				class="absolute mt-3 origin-top-right right-0 max-h-96
  				 	   w-[440px] z-20 rounded bg-white text-[13px]
  					   border border-gray-300 py-4 pl-3 pr-4 shadow-lg"
  			>
			  	<div class="absolute top-0 right-7 w-4 h-4 float-left
					-mt-2 mr-5 border-gray-300 rotate-45
					bg-white rounded-sm border-t border-l">
  				</div>
  				<div class="flex flex-col space-y-3 overflow-y-auto">
  					<div 
  						v-if="friendRequests.length == 0" 
  						class="text-[13px] text-center"
  					>
  						You have no friend requests at this time
  					</div>
  					<div v-for="request in friendRequests" :key="request.id">
  						<Component
  							:is="decideRequest(request)"
  							:request="request"
  							@accepted="acceptFriendRequest(request.id)"
  							@declined="declineFriendRequest(request.id)"
  							@deleted="deleteFriend(request.sender.username)"
  							@modalOpened="isDialogOpen = true"
  							@modalClosed="isDialogOpen = false"
  						></Component>
  					</div>
  				</div>
  			</PopoverPanel>
  		</transition>
  	</Popover>
  `,
  components: {
    Popover,
    PopoverButton,
    PopoverPanel,
    HeartIconOutline,
    HeartIconSolid,
    SlotWatcher,
    Button,
    AcceptedRequest,
    PendingRequest,
  },

  async setup() {
    const friendRequests = ref([])
    const isDialogOpen = ref(false)
    const router = useRouter()

    const fetchRequests = async () => {
      const [data] = await api.users.getFriendRequests()

      if (data) {
        friendRequests.value = data
        hasNotification.value = data.some(r => r.isPending)
      }
    }

    const decideRequest = request =>
      request.isAccepted ? AcceptedRequest : PendingRequest

    const setRequest = request => {
      const index = friendRequests.value.findIndex(r => r.id == request.id)
      friendRequests.value[index] = request
      if (
        router.currentRoute.value.name == 'profile' &&
        router.currentRoute.value.params.usename != user.username
      )
        router.go()
    }

    const acceptFriendRequest = async id => {
      const [data] = await api.users.acceptFriendRequest(id)

      if (data) {
        setRequest(data)
        hasNotification.value = friendRequests.value.some(r => r.isPending)
      }
    }

    const declineFriendRequest = async id => {
      const [data] = await api.users.declineFriendRequest(id)

      if (data) {
        friendRequests.value = friendRequests.value.filter(
          fr => fr.id != data.id
        )
        hasNotification.value = friendRequests.value.some(r => r.isPending)
      }
    }

    const deleteFriend = async username => {
      const [data] = await api.users.removeFriend(username)
      data && setRequest(data)
    }

    return {
      friendRequests,
      decideRequest,
      isDialogOpen,
      fetchRequests,
      acceptFriendRequest,
      declineFriendRequest,
      deleteFriend,
      hasNotification,
    }
  },
}
