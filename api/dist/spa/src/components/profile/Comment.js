import XIcon from '/modules/@heroicons/vue/outline/XIcon.js'
import { ref } from '/modules/vue.js'
import DeleteCommentDialog from '/src/components/profile/DeleteCommentDialog.js'
import { transformDate } from '/src/components/utility/dates.js'
export default {
  template: `  
  	<div class="flex space-x-4 w-full relative">
  		<img :src="imageURL" alt="Profile picture" class="w-7 h-7 rounded-full border border-gray-300" />
  		<div>
  			<RouterLink 
  				as="span"
  				:to="'/' + username"
  				class="font-medium"
  			>
  				{{ username }}
  			</RouterLink>
  			{{ text }}
  			<div class="text-xs text-gray-400 mt-2">{{ transformDate(date) }}</div>
  		</div>
  		<button
  			v-if="isDeletable"
  			@click="isModalOpen = true"
  			class="absolute right-0 opacity-30 hover:opacity-100 focus:outline-none"
  		>
  			<XIcon class="h-4 w-4" />
  		</button>
  	</div>
  	<DeleteCommentDialog 
  		@delete="e => {
  			$emit('delete', id)
  			isModalOpen = false
  		}"
  		@modalClosed="isModalOpen = false"
  		:isOpen="isModalOpen"
  	/>
  `,
  components: {
    XIcon,
    DeleteCommentDialog,
  },
  props: ['id', 'imageURL', 'username', 'text', 'date', 'isDeletable'],
  emits: ['delete'],

  setup() {
    const isModalOpen = ref(false)
    return {
      transformDate,
      isModalOpen,
    }
  },
}
