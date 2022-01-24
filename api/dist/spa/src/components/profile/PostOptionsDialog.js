import { useRouter } from '/modules/vue-router.js'
import api from '/src/api/api.js'
import Modal from '/src/components/ui/Modal.js'
import { closeDialog } from '/src/store/dialogStore.js'
import { user } from '/src/store/userStore.js'
export default {
  template: `  
  	<Modal :isOpen="isOpen" class="bg-white max-w-sm text-sm">
  		<div class="divide-y divide-gray-300">
  			<button @click="deletePost()" class="text-red-500 font-medium py-4 px-20 w-full">Delete post</button>
  			<button @click="setAsPfp()" class="w-full p-4">Set as profile picture</button>
  			<button @click="$emit('modalClosed')" class="w-full p-4">Cancel</button>
  		</div>
  	</Modal>
  `,
  components: {
    Modal,
  },
  props: ['isOpen', 'post'],

  async setup(props, { emit }) {
    const router = useRouter()

    const setAsPfp = async () => {
      const [data, error] = await api.posts.setAsProfilePicture(props.post.id)

      if (!error) {
        user.imageURL = data
        emit('modalClosed')
        closeDialog() // setTimeout(() => router.push({ name: 'profile', params: { username: props.post.poster.username }}), 100)
      }
    }

    const deletePost = async () => {
      await api.posts.deletePost(props.post.id)
      emit('modalClosed')
      closeDialog()
      setTimeout(() => router.go(), 150)
    }

    return {
      setAsPfp,
      deletePost,
    }
  },
}
