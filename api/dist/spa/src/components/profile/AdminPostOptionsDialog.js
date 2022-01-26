import { ref } from '/modules/vue.js'
import api from '/src/api/api.js'
import Modal from '/src/components/ui/Modal.js'
import { closeDialog } from '/src/store/dialogStore.js'
import { removePost } from '/src/store/feedStore.js'
export default {
  template: `  
  	<Modal :isOpen="isOpen" class="bg-white max-w-sm text-sm">
  		<div class="divide-y divide-gray-300 ">
  			<div class="w-full px-6 pt-8 pb-5 space-y-5">
  				<div>Please explain why you want to delete this post. <span class="text-gray-400">(E.g. "It is abusive or harmful.")  </span></div>
  				<textarea 
  				rows="5"
  				placeholder="Enter a message here.."
  				v-model="deleteMessage" 
  				class="text-sm rounded-sm border border-gray-300 focus:ring-0 resize-none w-full focus:border-gray-300">
  				</textarea>
  			</div>
  			<button @click="deletePost()" class="text-red-500 font-medium py-4 px-20 w-full">Delete post</button>
  			<button @click="$emit('modalClosed')" class="w-full p-4">Cancel</button>
  		</div>
  	</Modal>
  `,
  components: {
    Modal,
  },
  props: ['isOpen', 'post'],

  async setup(props, { emit }) {
    const deleteMessage = ref('')

    const deletePost = async () => {
      await api.posts.deletePost(props.post.id, deleteMessage.value)
      emit('modalClosed')
      closeDialog()
      removePost(props.post)
    }

    return {
      deleteMessage,
      deletePost,
    }
  },
}
