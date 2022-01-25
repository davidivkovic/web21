import { ref, watch } from '/modules/vue.js'
import SpinIcon from '/src/icons/SpinIcon.js'
import { fetchMessages } from '/src/store/chatStore.js'
export default {
  template: `  
      <SpinIcon v-if="isFetching" class="mx-auto w-5 h-5 mt-4"/>
      <div 
          @scroll="e => onScroll(e)"
          class="flex-1 flex flex-col-reverse w-full px-5 overflow-y-auto
                 pt-4 pb-1 space-y-reverse space-y-2 overscroll-contain"
      >
          <span 
              v-if="isSeen"
              class="ml-auto transition-all mr-2 -mb-1 z-50 text-[11px] text-neutral-500"
          >
              Seen
          </span>
          <div 
              v-for="(message, index) in messages"
              :key="message.id"
              class="flex items-end "
          >
              <img 
                  v-if="imageVisible(index)"
                  :src="recipient.imageURL" alt=""
                  class="h-6 w-6 mr-1.5 rounded-full"
              />
              <div v-else class="h-6 w-6 mr-1.5"></div>
              <span
                  v-if="!isOnlyEmoji(message.content)"
                  :class="[
                      isMine(message) ? 'ml-auto bg-neutral-100' : 'bg-white border' 
                  ]"
                  class="px-4 py-3 leading-snug min-w-min whitespace-pre-line
                         text-[13.5px] rounded-3xl  max-w-[70%] lg:max-w-[45%]"
              >
                  {{ message.content }}
              </span>
              <span 
                  v-else
                  :class="isMine(message) ? 'ml-auto': '-ml-1'"
                  class="text-5xl tracking-tighter"
              >
                  {{ message.content }}
              </span>
          </div>
      </div>
  `,
  props: {
    seenPointer: String,
    messages: Array,
    sender: Object,
    recipient: Object,
  },
  components: {
    SpinIcon,
  },

  async setup(props) {
    let exhausted = false
    const isFetching = ref(false)
    const message = props.messages.at(0)
    const isSeen = ref(
      props.seenPointer == message?.id && message.senderId == props.sender.id
    )

    const isOnlyEmoji = string => /^\p{Emoji}*$/u.test(string)

    const isMine = message => message?.senderId == props.sender.id

    const imageVisible = messageIndex => {
      const notMine = !isMine(props.messages.at(messageIndex))
      return (
        (notMine && messageIndex == 0) ||
        (notMine && isMine(props.messages.at(messageIndex - 1)))
      )
    }

    const onScroll = async ({
      target: { scrollTop, clientHeight, scrollHeight },
    }) => {
      if (
        clientHeight - scrollTop + 10 >= scrollHeight &&
        !isFetching.value &&
        !exhausted
      ) {
        isFetching.value = true
        const hasMore = await fetchMessages()
        exhausted = !hasMore
        isFetching.value = false
      }
    }

    watch(
      () => props.messages.at(0),
      () => (isSeen.value = false)
    )
    watch(
      () => props.seenPointer,
      () => (isSeen.value = true)
    )
    return {
      isMine,
      imageVisible,
      isOnlyEmoji,
      onScroll,
      isSeen,
      isFetching,
    }
  },
}
