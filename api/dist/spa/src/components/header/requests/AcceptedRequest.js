import { ref } from '/modules/vue.js'
import Request from '/src/components/header/requests/Request.js'
import DeleteFriendDialog from '/src/components/profile/DeleteFriendDialog.js'
import Button from '/src/components/ui/Button.js'
export default {
  template: `  
  <div>
  	<Request :request="request">
  		<template v-slot:text>is now your friend</template>
  		<template v-slot:buttons>
  			<Button
  				@click="openDialog()"
  				class="font-medium ml-4 h-[30px] py-0 leading-4 !text-[13px] !px-4 text-black border border-gray-300 whitespace-nowrap"
  			>Accepted</Button>
  		</template>
  	</Request>
  	<DeleteFriendDialog
  		:isOpen="isDialogOpen"
  		@deleteFriend="$emit('deleted', request.id)"
  		@modalClosed="closeDialog()"
  		:username="request.sender.username"
  		:imageURL="request.sender.imageURL"
  	/>
  </div>
  `,
  props: ['request'],
  components: {
    Request,
    Button,
    DeleteFriendDialog,
  },
  emits: ['modalOpened', 'modalClosed', 'deleted'],

  setup(props, { emit }) {
    const isDialogOpen = ref(false)

    const openDialog = () => {
      isDialogOpen.value = true
      emit('modalOpened')
    }

    const closeDialog = () => {
      console.log('closed')
      isDialogOpen.value = false
      emit('modalClosed')
    }

    return {
      isDialogOpen,
      openDialog,
      closeDialog,
    }
  },
}
