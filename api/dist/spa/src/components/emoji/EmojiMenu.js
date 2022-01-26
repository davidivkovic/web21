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
  			<SmileyIcon :class="large ? 'w-6 h-6 text-black' : 'text-gray-500'" />
  		</PopoverButton>
  		<PopoverPanel class="absolute z-10">
  			<div class="absolute bg-gray-50 rounded-md w-[300px] pl-1 py-1 border" :class="menuPositionClass">
  				<div
  					class="grid overflow-x-hidden grid-cols-6 md:grid-cols-7 h-56 pl-1 py-1 overflow-y-scroll"
  				>
  					<div v-for="(emoji, idx) in emojis" :key="idx" class="w-10 h-10">
  						<Emoji class="text-2xl" :emoji="emoji" @click="$emit('select', emoji)" />
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
    large: Boolean,
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

    const emojis = emojiGroupList
      .slice(0, 2)
      .flatMap(g => g.el)
      .map(e => e.u)
      .slice(0, 200)
    return {
      group,
      emojis,
      toggleEmojis,
      menuPositionClass,
    }
  },
}
