import {
  onBeforeRouteLeave,
  onBeforeRouteUpdate,
  useRoute,
} from '/modules/vue-router.js'
import { computed, onBeforeMount, ref } from '/modules/vue.js'
import ChatCard from '/src/components/direct/ChatCard.js'
import ChatPanel from '/src/components/direct/ChatPanel.js'
import FriendsDialog from '/src/components/direct/FriendsDialog.js'
import Button from '/src/components/ui/Button.js'
import NewMessageIcon from '/src/icons/NewMessageIcon.js'
import {
  conversations,
  currentConversation,
  getConversation,
  getConversations,
  invite,
  setcurrentConversation,
} from '/src/store/chatStore.js'
import { user } from '/src/store/userStore.js'
export default {
  template: `  
  	<FriendsDialog 
  		:isOpen="friendsDialogOpen"
  		@modalClosed="toggleFriendsDialog()"
  		@select="username => newConversation(username)"
  	/>
  	<div class="absolute left-0 right-0 h-full w-full md:pt-4 md:pb-5">
  		<div class="flex bg-white border md:border-zinc-300 
  				    rounded h-full md:max-w-[50rem] lg:max-w-4xl mx-auto"
  		>
  			<div class="flex flex-col basis-72 md:basis-80 flex-grow-0 
  						flex-shrink-0 border-r border-zinc-300"
  			>
  				<div class="flex h-[60px] relative justify-center items-center
  							text-[15px] font-medium border-b border-zinc-300"
  				>
  					<div>
  						{{ user.username }}
  					</div>
  					<button class="absolute right-5">
  						<NewMessageIcon @click="toggleFriendsDialog()" />
  					</button>
  				</div>
  				<div
  					@scroll="e => onScroll(e)"
  				 	class="flex-1 overflow-y-auto"
  				>
  					<div 
  						v-for="conversation in conversations"
  						:key="conversation.id"
  					>
  						<ChatCard 
  							@click="setcurrentConversation(conversation)"
  							:selected="currentConversation.id == conversation.id"
  							:convo="conversation"
  						/>
  					</div>
  				</div>
  			</div>
  			<div class="flex-1">
  				<div v-if="chatVisible" class="h-full">
  					<ChatPanel :conversation="currentConversation"/>
  				</div>
  				<div v-else class="flex items-center justify-center h-full">
  					<div class="text-center space-y-3">
  						<img 
  							src="/src/assets/images/direct-arrow-large.png" alt=""
  							class="w-24 h-24 mx-auto object-cover"
  						>
  						<div>
  							<h2 class="text-lg">Your messages</h2>
  							<div class="text-xs text-gray-500 mt-1 mb-3">
  								Send private photos and messages to a friend or group.
  							</div>
  						</div>
  						<Button
  							@click="toggleFriendsDialog()"
  							class="bg-black text-white"
  						>
  							Send Message
  						</Button>
  					</div>
  				</div>
  			</div>
  		</div>
  	</div>
  `,
  name: 'direct',
  components: {
    Button,
    NewMessageIcon,
    ChatCard,
    ChatPanel,
    FriendsDialog,
  },

  async setup() {
    onBeforeMount(() => (document.title = 'Instagram • Chats'))
    onBeforeRouteUpdate((to, from) => {
      from.params.id != undefined &&
        to.params.id == undefined &&
        (currentConversation.value = {})
    })
    onBeforeRouteLeave(() => {
      currentConversation.value = {}
    })
    const route = useRoute()
    const friendsDialogOpen = ref(false)
    const chatVisible = computed(
      () => Object.keys(currentConversation.value).length > 0
    )

    const toggleFriendsDialog = () =>
      (friendsDialogOpen.value = !friendsDialogOpen.value)

    const newConversation = async username => {
      toggleFriendsDialog()
      const conversation = await invite(username)
      conversation && setcurrentConversation(conversation)
    }

    await getConversations()

    if (route.params.id != undefined) {
      const found = await getConversation(route.params.id)
      found && setcurrentConversation(found)
    }

    const onScroll = ({
      target: { scrollTop, clientHeight, scrollHeight },
    }) => {
      if (scrollTop + clientHeight - 10 >= scrollHeight) {
        console.log('load more posts')
      }
    }

    return {
      user,
      conversations,
      currentConversation,
      chatVisible,
      setcurrentConversation,
      friendsDialogOpen,
      toggleFriendsDialog,
      newConversation,
      onScroll,
    }
  },
}
