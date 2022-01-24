import Modal from '/src/components/ui/Modal.js'
export default {
  template: `  
  	<Modal :isOpen="isOpen" @modalClosed="$emit('modalClosed')" class="bg-white max-w-sm text-sm">
  		<div class="divide-y divide-gray-300">
  			<div class="py-10 px-10 flex flex-col items-center justify-between space-y-8">
  				<img :src="imageURL" alt="Profile picture" class="rounded-full w-20 h-20" />
  				<div>
  					If you change your mind you'll have to send a friend request to
  					<span
  						class="font-medium"
  					>@{{ username }}</span> again.
  				</div>
  			</div>
  			<button @click="deleteFriend()" class="text-red-500 font-medium p-3 w-full">Delete friend</button>
  			<button @click="$emit('modalClosed')" class="w-full p-3">Cancel</button>
  		</div>
  	</Modal>
  `,
  components: {
    Modal,
  },
  props: ['isOpen', 'username', 'imageURL'],
  emits: ['modalClosed', 'deleteFriend'],

  setup(props, { emit }) {
    const deleteFriend = () => {
      emit('deleteFriend')
      emit('modalClosed')
    }

    return {
      deleteFriend,
    }
  },
}
