import {
  Popover,
  PopoverButton,
  PopoverPanel,
} from '/modules/headlessui-vue.js'
import Button from '/src/components/ui/Button.js'
import { transformDate } from '/src/components/utility/dates.js'
import SlotWatcher from '/src/components/utility/SlotWatcher.js'
import HeartIconOutline from '/src/icons/HeartIconOutline.js'
import HeartIconSolid from '/src/icons/HeartIconSolid.js'
export default {
  template: `  
  	<Popover v-slot="{ open }" class="mt-0.5">
  		<SlotWatcher :prop="open" />
  		<PopoverButton>
  			<HeartIconSolid v-if="open" />
  			<HeartIconOutline v-else />
  		</PopoverButton>
  		<transition
  			enter-active-class="transition duration-200 ease-out"
  			enter-from-class="translate-y-1 opacity-0"
  			enter-to-class="translate-y-0 opacity-100"
  			leave-active-class="transition duration-150 ease-in"
  			leave-from-class="translate-y-0 opacity-100"
  			leave-to-class="translate-y-1 opacity-0"
  		>
  			<PopoverPanel
  				class="absolute right-0 max-h-96 z-10 bg-white text-[13px] p-5 space-y-5 overflow-y-scroll shadow-lg"
  			>
  				<div v-for="request in friendRequests">
  					<div class="flex items-center justify-between space-x-28">
  						<div class="flex items-center space-x-3">
  							<img :src="request.sender.imageURL" class="rounded-full w-10 h-10" />
  							<div class="font-medium">{{ request.sender.username }}</div>
  							<div class="text-gray-400">{{ transformDate(request.timestamp) }}</div>
  						</div>
  						<div v-if="request.status === 'Pending'" class="space-x-2">
  							<Button
  								class="font-medium text-xs px-5 text-white bg-black border border-gray-300 whitespace-nowrap"
  							>Accept</Button>
  						</div>
  						<div v-else>
  							<Button
  								class="font-medium text-xs px-5 text-black border border-gray-300 whitespace-nowrap"
  							>Delete</Button>
  						</div>
  					</div>
  				</div>
  			</PopoverPanel>
  		</transition>
  	</Popover>
  `,
  components: {
    Popover,
    PopoverButton,
    PopoverPanel,
    HeartIconOutline,
    HeartIconSolid,
    SlotWatcher,
    Button,
  },

  setup() {
    const friendRequests = [
      {
        sender: {
          username: 'dzimox',
          imageURL:
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfDJ8MHx8&auto=format&fit=crop&w=500&q=60',
        },
        timestamp: '2022-01-14T17:27:25.416937200',
        status: '',
      },
      {
        sender: {
          username: 'dzimox',
          imageURL:
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfDJ8MHx8&auto=format&fit=crop&w=500&q=60',
        },
        timestamp: '2022-01-14T17:27:25.416937200',
        status: 'Pending',
      },
      {
        sender: {
          username: 'dzimox',
          imageURL:
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfDJ8MHx8&auto=format&fit=crop&w=500&q=60',
        },
        timestamp: '2022-01-14T17:27:25.416937200',
        status: 'Accepted',
      },
      {
        sender: {
          username: 'dzimox',
          imageURL:
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfDJ8MHx8&auto=format&fit=crop&w=500&q=60',
        },
        timestamp: '2022-01-14T17:27:25.416937200',
        status: 'Pending',
      },
    ]
    return {
      friendRequests,
      transformDate,
    }
  },
}
