import { useEmojiTextArea } from '../emoji/emojiTextArea.js'
import Comment from './Comment.js'
import { useRouter } from '/modules/vue-router.js'
import { ref, watchEffect } from '/modules/vue.js'
import EmojiMenu from '/src/components/emoji/EmojiMenu.js'
import Button from '/src/components/ui/Button.js'
import Modal from '/src/components/ui/Modal.js'
import { closeDialog, isDialogOpen } from '/src/store/dialogStore.js'
import { user } from '/src/store/userStore.js'
export default {
  template: `  
  	<Modal
  		:isOpen="isOpen"
  		@modalClosed="closeDialog()"
  		class="bg-white h-5/6 text-sm"
  		style="width: calc(100vh * 1.2)"
  		:isClosable="!emojisVisible"
  	>
  		<div class="flex h-full">
  			<img :src="post.imageURL" class="object-cover h-full w-[65%] rounded-l-lg" />
  			<div class="h-full border-l w-[35%] border-gray-300 flex flex-col relative">
  				<div class="pt-5 pb-5 px-4 space-y-2 border-b border-gray-300 h-max">
  					<div class="flex items-center space-x-3">
  						<img
  							:src="post.poster.imageURL"
  							alt="Profile picture"
  							class="w-7 h-7 rounded-full border border-gray-300"
  						/>
  						<p class="text-[15px] font-medium">{{ post.poster.username }}</p>
  					</div>
  				</div>
  				<div class="flex-1 pl-4 pr-5 py-5 text-left space-y-4 overflow-y-scroll">
  					<Comment
  						:imageURL="post.poster.imageURL"
  						:username="post.poster.username"
  						:text="post.caption"
  						:date="post.timestamp"
  						:isDeletable="false"
  					></Comment>
  					<div v-for="comment in post.comments">
  						<Comment
  							:imageURL="comment.user.imageURL"
  							:username="comment.user.username"
  							:text="comment.content"
  							:date="comment.timestamp"
  							:isDeletable="comment.user.username === user.username"
  						></Comment>
  					</div>
  				</div>
  				<div
  					class="bottom-0 flex justify-between items-start w-full space-x-3 px-4 py-3 border-t border-gray-300"
  				>
  					<EmojiMenu
  						position="top"
  						@close="value => emojisVisible = value"
  						@select="emojiSelected"
  						class="pt-0.5"
  					></EmojiMenu>
  					<textarea
  						spellcheck="false"
  						maxlength="500"
  						name="text"
  						rows="4"
  						placeholder="Add a comment..."
  						ref="commentTextArea"
  						v-model="commentText"
  						class="text-[15px] border-none focus:ring-0 resize-none w-full p-0"
  					></textarea>
  					<button @click="postComment()" class="text-sm font-medium text-blue-400">Post</button>
  				</div>
  			</div>
  		</div>
  	</Modal>
  `,
  components: {
    Modal,
    Button,
    EmojiMenu,
    Comment,
  },
  props: ['ime'],

  setup(props) {
    const post = {
      poster: {
        username: 'dracaa.m',
        imageURL:
          'https://i.pinimg.com/originals/04/e1/7a/04e17aadb6a029518f4b2a45f7053c65.png',
      },
      imageURL:
        'https://cb.scene7.com/is/image/Crate/Plush_MD_Bear_BR/$web_pdp_main_carousel_med$/190411135342/jellycat-medium-brown-bear-stuffed-animal.jpg',
      caption:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      timestamp: '2022-01-11T17:27:25.416937200',
      comments: [
        {
          user: {
            username: 'landooo',
            imageURL:
              'https://image-cdn.essentiallysports.com/wp-content/uploads/2021-09-02T134401Z_1019647666_UP1EH92125A56_RTRMADP_3_MOTOR-F1-NETHERLANDS-1110x1065.jpg',
          },
          timestamp: '2022-01-05T17:27:25.416937200',
          content: 'You are very cute',
        },
        {
          user: {
            username: 'dracaa.m',
            imageURL:
              'https://i.pinimg.com/originals/04/e1/7a/04e17aadb6a029518f4b2a45f7053c65.png',
          },
          timestamp: '2022-01-05T17:27:25.416937200',
          content: 'Thanks',
        },
        {
          user: {
            username: 'landooo',
            imageURL:
              'https://image-cdn.essentiallysports.com/wp-content/uploads/2021-09-02T134401Z_1019647666_UP1EH92125A56_RTRMADP_3_MOTOR-F1-NETHERLANDS-1110x1065.jpg',
          },
          timestamp: '2022-01-05T17:27:25.416937200',
          content: 'You are very cute',
        },
        {
          user: {
            username: 'landooo',
            imageURL:
              'https://image-cdn.essentiallysports.com/wp-content/uploads/2021-09-02T134401Z_1019647666_UP1EH92125A56_RTRMADP_3_MOTOR-F1-NETHERLANDS-1110x1065.jpg',
          },
          timestamp: '2022-01-05T17:27:25.416937200',
          content: 'You are very cute',
        },
        {
          user: {
            username: 'landooo',
            imageURL:
              'https://image-cdn.essentiallysports.com/wp-content/uploads/2021-09-02T134401Z_1019647666_UP1EH92125A56_RTRMADP_3_MOTOR-F1-NETHERLANDS-1110x1065.jpg',
          },
          timestamp: '2022-01-05T17:27:25.416937200',
          content: 'You are very cute',
        },
        {
          user: {
            username: 'landooo',
            imageURL:
              'https://image-cdn.essentiallysports.com/wp-content/uploads/2021-09-02T134401Z_1019647666_UP1EH92125A56_RTRMADP_3_MOTOR-F1-NETHERLANDS-1110x1065.jpg',
          },
          timestamp: '2022-01-05T17:27:25.416937200',
          content: 'You are very cute',
        },
        {
          user: {
            username: 'landooo',
            imageURL:
              'https://image-cdn.essentiallysports.com/wp-content/uploads/2021-09-02T134401Z_1019647666_UP1EH92125A56_RTRMADP_3_MOTOR-F1-NETHERLANDS-1110x1065.jpg',
          },
          timestamp: '2022-01-05T17:27:25.416937200',
          content: 'You are very cute',
        },
        {
          user: {
            username: 'landooo',
            imageURL:
              'https://image-cdn.essentiallysports.com/wp-content/uploads/2021-09-02T134401Z_1019647666_UP1EH92125A56_RTRMADP_3_MOTOR-F1-NETHERLANDS-1110x1065.jpg',
          },
          timestamp: '2022-01-05T17:27:25.416937200',
          content: 'You are very cute',
        },
        {
          user: {
            username: 'landooo',
            imageURL:
              'https://image-cdn.essentiallysports.com/wp-content/uploads/2021-09-02T134401Z_1019647666_UP1EH92125A56_RTRMADP_3_MOTOR-F1-NETHERLANDS-1110x1065.jpg',
          },
          timestamp: '2022-01-05T17:27:25.416937200',
          content: 'You are very cute',
        },
        {
          user: {
            username: 'landooo',
            imageURL:
              'https://image-cdn.essentiallysports.com/wp-content/uploads/2021-09-02T134401Z_1019647666_UP1EH92125A56_RTRMADP_3_MOTOR-F1-NETHERLANDS-1110x1065.jpg',
          },
          timestamp: '2022-01-05T17:27:25.416937200',
          content: 'You are very cute',
        },
      ],
      commentCount: 6,
    }
    const commentTextArea = ref(null)
    const emojisVisible = ref(false)
    const isOpen = ref(false)
    const router = useRouter()
    const { emojiSelected, text: commentText } =
      useEmojiTextArea(commentTextArea)
    watchEffect(() => {
      setTimeout(() => (isOpen.value = isDialogOpen.value), 0)
      !isDialogOpen.value && setTimeout(() => router.back(), 200)
    })

    const postComment = () => {
      console.log(commentText.value)
    }

    console.log(props)
    return {
      post,
      user,
      isOpen,
      closeDialog,
      emojisVisible,
      emojiSelected,
      commentText,
      commentTextArea,
      postComment,
    }
  },
}
