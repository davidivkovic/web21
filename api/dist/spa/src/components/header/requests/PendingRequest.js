import { ref } from '/modules/vue.js'
import Request from '/src/components/header/requests/Request.js'
import Button from '/src/components/ui/Button.js'
import SpinIcon from '/src/icons/SpinIcon.js'
export default {
  template: `  
  	<Request :request="request">
  		<template v-slot:text>wants to be your friend</template>
  		<template v-slot:buttons>
  			<div class="space-x-2 flex ml-10">
  				<Button
  					@click="acceptFriendRequest()"
  					class="font-medium h-[30px] py-0 leading-4 !text-[13px] !w-20 text-white bg-black flex items-center justify-center border-gray-300 whitespace-nowrap"
  				>
  					<p v-if="!isLoading">Accept</p>
  					<SpinIcon v-else class="w-full" />
  				</Button>
  				<Button
  					@click="declineFriendRequest()"
  					class="font-medium h-[30px] py-0 leading-4 !text-[13px] !px-4 text-black border border-gray-300 whitespace-nowrap"
  				>Delete</Button>
  			</div>
  		</template>
  	</Request>
  `,
  props: ['request'],
  emits: ['accepted', 'declined'],
  components: {
    Request,
    Button,
    SpinIcon,
  },

  setup(props, { emit }) {
    const isLoading = ref(false)

    const acceptFriendRequest = () => {
      emit('accepted', props.request.id)
      isLoading.value = true
      setTimeout(() => {
        isLoading.value = false
      }, 250)
    }

    const declineFriendRequest = () => {
      emit('declined', props.request.id)
    }

    return {
      isLoading,
      acceptFriendRequest,
      declineFriendRequest,
    }
  },
}
