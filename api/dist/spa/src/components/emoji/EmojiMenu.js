import Emoji from './Emoji.js'
import emojiGroupList from './emojis.js'
import {
  Popover,
  PopoverButton,
  PopoverPanel,
} from '/modules/headlessui-vue.js'
import { ref } from '/modules/vue.js'
import SlotWatcher from '/src/components/utility/SlotWatcher.js'
import SmileyIcon from '/src/icons/SmileyIcon.js'
export default {
  template: `  
  	<Popover class="inline-flex" v-slot="{ open }" @change="toggleEmojis">
  		<SlotWatcher :prop="open"></SlotWatcher>
  		<PopoverButton class="focus:outline-none">
  			<SmileyIcon class="text-2xl" />
  		</PopoverButton>
  		<PopoverPanel class="absolute z-10">
  			<div class="absolute bg-gray-50 rounded-md w-72 p-0.5 border" :class="menuPositionClass">
  				<!-- <div
  						class="flex flex-row justify-center align-center p-0.5 h-10 overflow-x-auto overflow-y-hidden"
  					>
  						<div v-for="tab in emojis" :key="tab.group">
  							<Emoji class="w-6 h-6 text-xl p-px" :emoji="tab.el[0].u" @tapped="group = tab.group" />
  						</div>
  				</div>-->
  				<div
  					v-for="(list, index) in emojis"
  					v-show="index === group"
  					:key="index"
  					class="grid grid-cols-5 md:grid-cols-8 col-start-1 row-start-1 place-content-start gap-0 justify-items-center items-center h-56 p-1 overflow-y-scroll"
  				>
  					<div v-for="emoji in list.el" :key="emoji.u" class="w-10 h-10">
  						<Emoji class="text-xl" :emoji="emoji.u" @click="$emit('select', emoji.u)" />
  					</div>
  				</div>
  			</div>
  		</PopoverPanel>
  	</Popover>
  `,
  components: {
    Emoji,
    Popover,
    PopoverButton,
    PopoverPanel,
    SmileyIcon,
    SlotWatcher,
  },
  props: {
    isOpen: Boolean,
    position: {
      required: false,
      type: String,
      default: 'bottom',
      validator: value =>
        ['top', 'bottom', 'right'].includes(value.toLowerCase()),
    },
  },
  emits: ['select', 'close'],

  setup(props, { emit }) {
    const group = ref(0)
    let menuPositionClass

    if (props.position === 'right') {
      menuPositionClass = 'left-7'
    } else if (props.position === 'bottom') {
      menuPositionClass = 'top-7'
    } else menuPositionClass = 'bottom-4'

    const toggleEmojis = value => {
      setTimeout(() => emit('close', value), 100)
    }

    const emojis = emojiGroupList.slice(0, 3)
    return {
      group,
      emojis,
      toggleEmojis,
      menuPositionClass,
    }
  },
}
