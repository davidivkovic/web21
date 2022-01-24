import { useEmojiTextArea } from '../emoji/emojiTextArea.js'
import Comment from './Comment.js'
import DotsHorizontalIcon from '/modules/@heroicons/vue/outline/DotsHorizontalIcon.js'
import { useRoute } from '/modules/vue-router.js'
import { computed, ref } from '/modules/vue.js'
import api from '/src/api/api.js'
import EmojiMenu from '/src/components/emoji/EmojiMenu.js'
import AdminPostOptionsDialog from '/src/components/profile/AdminPostOptionsDialog.js'
import PostOptionsDialog from '/src/components/profile/PostOptionsDialog.js'
import Button from '/src/components/ui/Button.js'
import Modal from '/src/components/ui/Modal.js'
import { closeDialog, isDialogOpen } from '/src/store/dialogStore.js'
import { isAuthenticated, user } from '/src/store/userStore.js'
export default {
  template: `  
  	<Modal
  		:isOpen="isDialogOpen"
  		@modalClosed="closeDialog()"
  		class="bg-white h-[90%] text-sm"
  		style="width: calc(100vh * 1.4)"
  	>
  		<div class="flex h-full">
  			<img :src="post.imageURL" class="object-cover w-[60%] h-full rounded-l-md" />
  			<div class="h-full flex-1 border-l border-gray-300 flex flex-col relative">
  				<div class="pt-5 pb-5 px-4 space-y-2 border-b border-gray-300 h-max">
  					<div class="flex items-center justify-between">
  						<RouterLink :to="{name: 'profile', params: {username: post.poster.username}}">
  							<div class="flex items-center space-x-3">
  								<img
  									:src="post.poster.imageURL"
  									alt="Profile picture"
  									class="w-7 h-7 rounded-full border border-gray-300"
  								/>
  								<p class="text-[15px] font-medium">{{ post.poster.username }}</p>
  							</div>
  						</RouterLink>
  						<button v-if="hasOptions" @click="openOptionsModal()">
  							<DotsHorizontalIcon class="h-5 w-5 focus:ring-0" />
  						</button>
  						<button @click="openAdminOptionsModal()" v-else-if="user.isAdmin" class="text-blue-400">Delete</button>
  					</div>
  				</div>
  				<div class="flex-1 pl-4 pr-5 py-5 text-left space-y-4 overflow-y-auto">
  					<Comment
  						:imageURL="post.poster.imageURL"
  						:username="post.poster.username"
  						:text="post.caption"
  						:date="post.timestamp"
  						:isDeletable="false"
  					/>
  					<div v-for="comment in post.comments">
  						<Comment
  							:id="comment.id"
  							:imageURL="comment.user.imageURL"
  							:username="comment.user.username"
  							:text="comment.content"
  							:date="comment.timestamp"
  							:isDeletable="comment.user.username === user.username"
  							@delete="id => deleteComment(id)"
  						/>
  					</div>
  				</div>
  				<div v-if="isAuthenticated"
  					class="flex justify-between items-start w-full space-x-3 px-4 py-3 border-t border-gray-300"
  				>
  					<EmojiMenu
  						position="top"
  						@close="value => emojisVisible = value"
  						@select="emojiSelected"
  						class="pt-0.5"
  					></EmojiMenu>
  					<textarea
  						@keydown.enter.exact.prevent="postComment()"
  						spellcheck="false"
  						maxlength="500"
  						name="text"
  						rows="4"
  						placeholder="Add a comment..."
  						ref="commentTextArea"
  						v-model="commentText"
  						class="text-[15px] border-none focus:ring-0 resize-none w-full p-0"
  					></textarea>
  					<button 
  						:disabled="commentText.trim().length == 0"
  						@click="postComment()"
  						class="text-sm font-medium text-blue-400 disabled:text-neutral-400"	
  					>
  						Post
  					</button>
  				</div>
  				<div v-else class="flex w-full px-4 py-6 border-t border-gray-300">
  					<RouterLink to="/" class="text-blue-400 mr-1">Log in</RouterLink>  
  					 to leave comments on posts.
  				</div>
  			</div>
  		</div>
  		<PostOptionsDialog 
  			@modalClosed="closeModal()"
  			:post="post"
  			:isOpen="isOptionsModalOpen"
  		/>
  		<AdminPostOptionsDialog 
  			@modalClosed="closeAdminModal()"
  			:post="post"
  			:isOpen="isAdminOptionsModalOpen"
  		/>
  	</Modal>
  `,
  components: {
    Modal,
    Button,
    EmojiMenu,
    Comment,
    DotsHorizontalIcon,
    PostOptionsDialog,
    AdminPostOptionsDialog,
  },

  async setup() {
    const commentTextArea = ref(null)
    const emojisVisible = ref(false)
    const isOptionsModalOpen = ref(false)
    const isAdminOptionsModalOpen = ref(false)
    const post = ref()
    const route = useRoute()
    let [data] = await api.posts.get(route.params.id)
    data && (post.value = data)
    const hasOptions = computed(
      () => post.value.poster.username === user.username
    )
    const { emojiSelected, text: commentText } =
      useEmojiTextArea(commentTextArea)

    const openOptionsModal = () => {
      isOptionsModalOpen.value = true
    }

    const openAdminOptionsModal = () => {
      isAdminOptionsModalOpen.value = true
    }

    const closeModal = () => {
      isOptionsModalOpen.value = false
    }

    const closeAdminModal = () => {
      isAdminOptionsModalOpen.value = false
    }

    const postComment = async () => {
      ;[data] = await api.posts.comment(post.value.id, commentText.value)

      if (data) {
        post.value.comments.push(data)
        commentText.value = ''
      }
    }

    const deleteComment = async commentId => {
      await api.posts.deleteComment(post.value.id, commentId)
      post.value.comments = post.value.comments.filter(c => c.id != commentId)
    }

    return {
      post,
      user,
      isAuthenticated,
      isDialogOpen,
      isAdminOptionsModalOpen,
      hasOptions,
      closeDialog,
      emojisVisible,
      emojiSelected,
      commentText,
      commentTextArea,
      postComment,
      openOptionsModal,
      closeModal,
      isOptionsModalOpen,
      deleteComment,
      openAdminOptionsModal,
      closeAdminModal,
    }
  },
}
