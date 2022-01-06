import FloatingInput from './FloatingInput.js'
import CheckIcon from '/modules/@heroicons/vue/solid/CheckIcon.js'
import ChevronDownIcon from '/modules/@heroicons/vue/solid/ChevronDownIcon.js'
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
} from '/modules/headlessui-vue.js'
import { ref, watchEffect } from '/modules/vue.js'
export default {
  template: `  
  	<div class="top-16">
  		<Listbox v-model="selectedValue">
  			<div class="relative">
  				<ListboxButton v-if="floating">
  					<FloatingInput
  						readonly
  						v-bind="$attrs"
  						v-model="selectedValue"
  						:name="name"
  						class="cursor-pointer h-10"
  					/>
  					<span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
  						<ChevronDownIcon class="w-5 h-5 text-gray-400" aria-hidden="true" />
  					</span>
  				</ListboxButton>
  
  				<ListboxButton v-else
  					class="relative px-2.5 text-xs text-left bg-gray-50 rounded border-gray-300 focus:ring-0 focus-visible:outline-none focus:border-gray-800 py-2.5 transition-colors placeholder-gray-400 w-full border"
  				>
  					<input
  						readonly
  						v-model="selectedValue"
  						:name="name"
  						class="bg-gray-50 w-full cursor-pointer focus-visible:outline-none"
  					/>
  					<span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
  						<ChevronDownIcon class="w-5 h-5 text-gray-400" aria-hidden="true" />
  					</span>
  				</ListboxButton>
  
  				<transition
  					leave-active-class="transition duration-100 ease-in"
  					leave-from-class="opacity-100"
  					leave-to-class="opacity-0"
  				>
  					<ListboxOptions
  						class="absolute w-full z-10 py-1 mt-1 overflow-auto text-xs bg-white rounded shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none"
  					>
  						<ListboxOption
  							v-slot="{ active, selected }"
  							v-for="value in values"
  							:key="value"
  							:value="value"
  							as="template"
  						>
  							<li
  								:class="[
  									active ? 'bg-gray-100' : 'text-gray-900',
  									'cursor-pointer select-none relative py-2 pl-9 pr-4',
  								]"
  							>
  								<span
  									:class="[
  										selected ? 'font-medium' : 'font-normal',
  										'block truncate',
  									]"
  								>{{ value }}</span>
  								<span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3">
  									<CheckIcon class="w-4 h-4" aria-hidden="true" />
  								</span>
  							</li>
  						</ListboxOption>
  					</ListboxOptions>
  				</transition>
  			</div>
  		</Listbox>
  	</div>
  `,
  props: {
    values: Array,
    name: String,
    floating: Boolean,
  },
  components: {
    Listbox,
    ListboxLabel,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    FloatingInput,
    CheckIcon,
    ChevronDownIcon,
  },

  setup(props, { emit }) {
    const selectedValue = ref()
    watchEffect(() => emit('change', selectedValue.value))
    selectedValue.value = props.values[0]
    return {
      selectedValue,
    }
  },
}
