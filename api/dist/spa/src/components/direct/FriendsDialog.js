import { ref, watch } from '/modules/vue.js'
import api from '/src/api/api.js'
import FriendsDialogRow from '/src/components/direct/FriendsDialogRow.js'
import Modal from '/src/components/ui/Modal.js'
import useDebouncedRef from '/src/components/utility/debounceRef.js'
import { user } from '/src/store/userStore.js'
export default {
  template: `  
  	<Modal
  		@modalClosed="clearQuery()"
  		:isOpen="isOpen"
  		class="bg-white max-w-sm w-[400px] h-2/3 relative"
  	>
  		<div class="divide-y divide-gray-300 flex flex-col h-full">
  			<div class="font-medium p-2">
  				<div class="tracking-tight">
  					New Message
  				</div>
  				<button
  					:disabled="selectedUser === null"
  					@click="confirm()"
  					class="absolute right-4 top-2.5 text-sm font-medium disabled:text-gray-300 text-blue-400"
  				>
  					Next
  				</button>
  			</div>
  			<div class="flex px-4 py-2 items-center justify-center space-x-4">
  				<label for="username" class="font-medium">To:</label>
  				<input
  					type="text"
  					autocomplete="off"
  					spellcheck="false"
  					name="username"
  					v-model="query"
  					placeholder="Search..."
  					class="border-0 w-full text-sm placeholder-zinc-300 focus:ring-0"
  				/>
  			</div>
  			<div class="text-left text-sm overflow-y-auto transition-all">
  				<div v-if="friends.length > 0" class="font-medium p-4">
  					Suggested
  				</div>
  				<div v-else class="p-4 text-neutral-500">
  					No account found.
  				</div>
  				<div v-for="friend in friends" :key="friend.username">
  					<FriendsDialogRow
  						@selected="u => selectUser(u)"
  						:username="friend.username"
  						:imageURL="friend.imageURL"
  						:fullName="friend.fullName"
  						:isSelected="friend.username === selectedUser"
  					/>
  				</div>
  			</div>
  		</div>
  	</Modal>
  `,
  components: {
    Modal,
    FriendsDialogRow,
  },
  props: ['isOpen'],
  emits: ['select', 'modalClosed'],

  async setup(props, { emit }) {
    let data
    const selectedUser = ref(null)
    const friends = ref([])
    const query = useDebouncedRef('', 200, true)
    watch(
      query,
      async newQuery => {
        selectedUser.value = null

        if (query.value.trim() == '') {
          [data] = await api.users.getFriends(user.username)
        } else {
          [data] = await api.users.searchUsernameFullName(newQuery)
        }

        data && (friends.value = data)
      },
      {
        immediate: true,
      }
    )

    const selectUser = username => {
      selectedUser.value = selectedUser.value == username ? null : username
    }

    const clearQuery = () => {
      selectedUser.value = null
      query.value = ''
    }

    const confirm = () => {
      emit('select', selectedUser.value)
      clearQuery()
    }

    return {
      query,
      selectedUser,
      selectUser,
      friends,
      confirm,
      clearQuery,
    }
  },
}
