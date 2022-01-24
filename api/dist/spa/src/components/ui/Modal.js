import XIcon from '/modules/@heroicons/vue/solid/XIcon.js'
import {
  Dialog,
  DialogOverlay,
  TransitionChild,
  TransitionRoot,
} from '/modules/headlessui-vue.js'
import { getCurrentInstance } from '/modules/vue.js'
import Button from '/src/components/ui/Button.js'
export default {
  template: `  
  	<TransitionRoot as="template" :show="isOpen" appear>
  		<Dialog
  			as="div"
  			static
  			class="fixed inset-0 overflow-y-auto z-20"
  			@close="emitModalClosed()"
  		>
  			<div
  				class="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0"
  			>
  				<TransitionChild
  					as="template"
  					enter="ease-out duration-150"
  					enter-from="opacity-0"
  					enter-to="opacity-100"
  					leave="ease-in duration-100"
  					leave-from="opacity-100"
  					leave-to="opacity-0"
  				>
  					<DialogOverlay 
  						class="fixed inset-0 transition-opacity bg-black/[85%]"
  						:class="{'bg-black/[55%]': light}"
  					/>
  				</TransitionChild>
  				<XIcon
  					class="absolute text-white cursor-pointer stroke-2 top-3 right-4 w-9 h-9"
  					@click="$emit('modalClosed')"
  				/>
  				<!-- This element is to trick the browser into centering the modal contents. -->
  				<!-- <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span> -->
  				<TransitionChild
  					as="template"
  					enter="ease-out duration-150"
  					enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
  					enter-to="opacity-100 translate-y-0 sm:scale-100"
  					leave="ease-in duration-100"
  					leave-from="opacity-100 translate-y-0 sm:scale-100"
  					leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
  				>
  					<div class="h-screen flex items-center justify-center">
  						<div class="transition-all duration-500 transform rounded-md shadow-xl" v-bind="$attrs">
  							<slot></slot>
  						</div>
  					</div>
  				</TransitionChild>
  			</div>
  		</Dialog>
  	</TransitionRoot>
  `,
  inheritAttrs: false,
  components: {
    Dialog,
    DialogOverlay,
    TransitionChild,
    TransitionRoot,
    Button,
    XIcon,
  },
  props: {
    isOpen: Boolean,
    classes: String,
    light: Boolean,
    // za kombinovanje modala i popover
    isClosable: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['modalClosed'],

  setup(props, { emit }) {
    const parent = getCurrentInstance().parent

    const emitModalClosed = () => {
      props.isClosable && emit('modalClosed')
      props.isClosable && parent.emit('modalClosed')
    }

    return {
      emitModalClosed,
    }
  },
}
