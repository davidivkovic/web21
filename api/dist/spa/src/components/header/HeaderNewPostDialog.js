import { useEmojiTextArea } from '../emoji/emojiTextArea.js'
import ArrowLeftIcon from '/modules/@heroicons/vue/outline/ArrowLeftIcon.js'
import { computed, ref } from '/modules/vue.js'
import api from '/src/api/api.js'
import EmojiMenu from '/src/components/emoji/EmojiMenu.js'
import Button from '/src/components/ui/Button.js'
import Modal from '/src/components/ui/Modal.js'
import MediaIcon from '/src/icons/MediaIcon.js'
import { closeDialog, isDialogOpen } from '/src/store/dialogStore.js'
import { newPost } from '/src/store/feedStore.js'
import { user } from '/src/store/userStore.js'
export default {
  template: `  
  	<Modal
  		:isOpen="isDialogOpen"
  		@modalClosed="closeDialog()"
  		class="bg-white h-4/5"
  		:style="modalStyle"
  		:isClosable="!emojisVisible"
  	>
  		<div class="flex border-b border-gray-300 items-center justify-center px-1">
  			<Button @click="isDetailsOpen = false">
  				<ArrowLeftIcon v-show="isDetailsOpen" class="w-6 h-6" />
  			</Button>
  			<span class="py-2 font-medium w-full">Create new post</span>
  			<Button
  				@click="sharePost()"
  				v-show="isDetailsOpen"
  				class="text-sm font-medium text-blue-400"
  			>Share</Button>
  		</div>
  		<div v-if="!isDetailsOpen" class="flex flex-col h-full items-center justify-center -mt-10">
  			<MediaIcon class="mx-auto" />
  			<p class="mt-4 text-xl">Drag photos here</p>
  			<input
  				@change="e => handleFileInput(e)"
  				type="file"
  				id="files"
  				name="files"
  				accept="image/png, image/jpeg, image/jpg"
  				class="hidden"
  			/>
  			<label
  				for="files"
  				class="mt-5 text-white text-sm bg-black rounded px-2 py-1.5 cursor-pointer"
  			>Select from computer</label>
  		</div>
  		<div v-else class="flex h-full pb-10">
  			<img :src="imageURL" alt="Profile picture" class="object-cover h-full w-[65%] rounded-bl-lg" />
  			<div class="h-full border-l w-[35%] border-gray-300">
  				<div class="px-4 pt-4 pb-3 space-y-2 border-b border-gray-300 h-max">
  					<div class="flex items-center space-x-3">
  						<img
  							:src="user.imageURL"
  							alt="Profile picture"
  							class="w-7 h-7 rounded-full border border-gray-300"
  						/>
  						<p class="text-[15px] font-medium">{{ user.username }}</p>
  					</div>
  					<div class="w-full p-1">
  						<textarea
  							spellcheck="false"
  							maxlength="500"
  							ref="captionTextArea"
  							name="text"
  							rows="7"
  							placeholder="Write a caption..."
  							class="text-[15px] border-none focus:ring-0 resize-none w-full p-0"
  							v-model="captionText"
  						></textarea>
  					</div>
  					<div class="flex justify-between items-end">
  						<EmojiMenu position="right" @close="value => emojisVisible = value" @select="emojiSelected"></EmojiMenu>
  						<span
  							class="text-xs text-gray-300 hover:text-gray-700 hover:cursor-default"
  						>{{ captionTextLength }}/500</span>
  					</div>
  				</div>
  			</div>
  		</div>
  	</Modal>
  `,
  components: {
    Modal,
    MediaIcon,
    Button,
    EmojiMenu,
    ArrowLeftIcon,
  },

  setup() {
    const isDetailsOpen = ref(false)
    const imageURL = ref('')
    const captionTextArea = ref(null)
    const emojisVisible = ref(false)
    let file
    const { emojiSelected, text: captionText } =
      useEmojiTextArea(captionTextArea)
    const captionTextLength = computed(() => captionText.value.length)
    const dialogWidthRatio = computed(() =>
      isDetailsOpen.value ? 1.125 : 0.75
    )
    const modalStyle = computed(
      () => `width: calc(100vh * ${dialogWidthRatio.value})`
    )

    const handleFileInput = fileEvent => {
      const reader = new FileReader()

      reader.onload = e => {
        imageURL.value = e.target.result
        isDetailsOpen.value = true
      }

      file = fileEvent.target.files[0]
      reader.readAsDataURL(file)
    }

    const sharePost = async () => {
      const [data] = await api.posts.upload(file, captionText.value)

      if (data) {
        newPost(data)
        closeDialog()
      }
    }

    return {
      user,
      isDialogOpen,
      closeDialog,
      handleFileInput,
      isDetailsOpen,
      dialogWidthRatio,
      imageURL,
      captionTextArea,
      captionText,
      captionTextLength,
      emojisVisible,
      emojiSelected,
      sharePost,
      modalStyle,
    }
  },
}
