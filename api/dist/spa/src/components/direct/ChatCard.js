import BadgeCheckIcon from '/modules/@heroicons/vue/solid/BadgeCheckIcon.js'
import { computed } from '/modules/vue.js'
import { transformDate } from '/src/components/utility/dates.js'
export default {
  template: `  
      <div 
          class="flex items-center space-x-2.5 px-5 py-2 cursor-pointer relative"
          :class="selected ? 'bg-gray-100' : 'hover:bg-gray-50'"
      >
          <img :src="convo.recipient.imageURL" alt="" class="w-14 h-14 rounded-full object-cover">
          <div class="flex-1">
              <div 
                  :class="{ 'font-medium': convo.hasUnread }"
                  class="text-sm relative"
              >
                  <span class="relative">
                      {{ convo.recipient.fullName }}
                      <BadgeCheckIcon 
                          v-if="convo.recipient.isAdmin"
                          class="w-5 h-5 absolute -top-px -right-6 text-blue-500"
                      />
                  </span>
              </div>
              <div 
                  v-if="lastMessage"
                  class="flex items-center pr-3 text-[13px] space-x-1 text-neutral-500"
              >
                  <span 
                      :class="{ 'font-medium text-black': convo.hasUnread }"
                      class="line-clamp-1 break-all"
                  >
                      {{ lastMessage.content }}
                  </span>
                  <span class="-mt-1.5">.</span>
                  <span 
                      :class="{ 'text-black': convo.hasUnread }"
                      class="whitespace-nowrap"
                  >
                      {{ timeAgo }}
                  </span>
              </div>
          </div>
          <div 
              v-if="convo.hasUnread"
              class="absolute right-4 h-2 w-2 rounded-full bg-blue-500"
          >
          </div>
      </div>
  `,
  components: {
    BadgeCheckIcon,
  },
  props: {
    convo: Object,
    selected: Boolean,
  },

  setup(props) {
    const lastMessage = computed(() => props.convo.messages.at(0))
    let timeAgo = computed(
      () => lastMessage && transformDate(lastMessage.value.sentAt)
    )
    return {
      timeAgo,
      lastMessage,
    }
  },
}
