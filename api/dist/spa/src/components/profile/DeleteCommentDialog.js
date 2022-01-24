import Modal from '/src/components/ui/Modal.js'
export default {
  template: `  
  	<Modal :isOpen="isOpen" class="bg-white max-w-sm text-sm">
  		<div class="divide-y divide-gray-300">
  			<button
  				@click="$emit('delete')"
  				class="text-red-500 font-medium py-4 px-20 w-full"
  			>
  				Delete comment
  			</button>
  			<button @click="$emit('modalClosed')" class="w-full p-4">Cancel</button>
  		</div>
  	</Modal>
  `,
  components: {
    Modal,
  },
  props: ['isOpen'],
  emits: ['delete', 'modalClosed'],
}
