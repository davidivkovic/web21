import ChatList from './ChatList.js'
import BadgeCheckIcon from '/modules/@heroicons/vue/solid/BadgeCheckIcon.js'
import { ref } from '/modules/vue.js'
import EmojiMenu from '/src/components/emoji/EmojiMenu.js'
import { useEmojiTextArea } from '/src/components/emoji/emojiTextArea.js'
import InfoIcon from '/src/icons/InfoIcon.js'
import { sendMessage as send } from '/src/store/chatStore.js'
export default {
  template: `  
      <div class="flex flex-col h-full w-full">
          <div class="h-[60px] border-b border-zinc-300">
              <div class="flex h-full justify-between items-center px-9">
                  <RouterLink 
                      as="div"
                      :to="'/' + conversation.recipient.username"
                      class="flex space-x-3 items-center"
                  >
                      <img 
                          :src="conversation.recipient.imageURL" alt=""
                          class="h-6 w-6 rounded-full"
                      >
                      <div class="flex items-center space-x-1 font-medium tracking-tight">
                          <span>
                              {{ conversation.recipient.fullName }}
                          </span>
                          <div
                              v-if="conversation.recipient.isAdmin" 
                              class="flex items-center space-x-1"
                          >
                              <BadgeCheckIcon class="w-5 h-5 text-blue-500"/>
                              <span class="text-xs font-bold tracking-wider text-blue-500">
                                  ADMIN
                              </span>
                          </div>
                      </div>
                  </RouterLink>
                  <InfoIcon class="cursor-pointer"/>
              </div>
          </div>
          <ChatList 
              :seenPointer="conversation.seenPointer"
              :messages="conversation.messages"
              :sender="conversation.sender"
              :recipient="conversation.recipient"
          />
          <div 
              style="word-break: break-word;"
              class="m-5 px-5 break-words min-h-[44px] max-h-28
                     border border-zinc-300 text-sm leading-4 
                     rounded-l-3xl rounded-r-3xl"
          >
              <div class="flex space-x-1 items-center h-full overflow-hidden">
                  <EmojiMenu 
                      large
                      position="top"
                      class="h-full"
                      @select="e => { 
                          emojiSelected(e)
                          resizeTextArea()
                      }"
                  />
                  <textarea 
                      ref="textArea"
                      rows="1"
                      maxlength="1000"
                      placeholder="Message..."
                      v-model="text"
                      @keypress.enter.exact.prevent="sendMessage()"
                      @input="resizeTextArea()"
                      @keypress="resizeTextArea()"
                      spellcheck="false"
                      class="w-full resize-none text-[13.5px] placeholder:tracking-tight
                              placeholder:text-neutral-500 leading-snug
                              focus:ring-0 border-none"
                      role="textbox"
                      id="chat-textarea"
                  />
                  <button
                      v-if="text.length > 0"
                      @click="sendMessage()"
                      class="text-blue-400 text-[13.5px] whitespace-nowrap h-full
                              font-semibold focus-visible:outline-none"
                  >
                      Send
                  </button>
              </div>
          </div>
      </div>
  `,
  props: {
    conversation: Object,
  },
  components: {
    EmojiMenu,
    ChatList,
    InfoIcon,
    BadgeCheckIcon,
  },

  setup(props) {
    document.title = 'Instagram • Chats'
    const textArea = ref(null)
    const { emojiSelected, text } = useEmojiTextArea(textArea)

    const resizeTextArea = () => {
      textArea.value.style.height = 'auto'
      const newHeight =
        text.value !== '' ? Math.min(112, textArea.value.scrollHeight + 2) : 36
      textArea.value.style.height = newHeight + 'px'
    }

    const sendMessage = () => {
      if (text.value.trim() != '') {
        send(props.conversation.id, text.value.trim())
        text.value = ''
        resizeTextArea()
      }
    }

    return {
      textArea,
      text,
      resizeTextArea,
      emojiSelected,
      sendMessage,
    }
  },
}
