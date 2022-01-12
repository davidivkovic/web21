import XIcon from '/modules/@heroicons/vue/outline/XIcon.js'
import { formatDistanceToNow, parseISO } from '/modules/date-fns.js'
export default {
  template: `  
  	<div class="flex space-x-4 w-full relative">
  		<img :src="imageURL" alt="Profile picture" class="w-7 h-7 rounded-full border border-gray-300" />
  		<div>
  			<span class="font-medium">{{ username }}</span>
  			{{ text }}
  			<div
  				class="text-xs text-gray-400 mt-2"
  			>{{ formatDistanceToNow(parseISO(date), { addSuffix: true }) }}</div>
  		</div>
  		<button
  			v-if="isDeletable"
  			@click="deleteComment()"
  			class="absolute right-0 opacity-30 hover:opacity-100 focus:outline-none"
  		>
  			<XIcon class="h-4 w-4" />
  		</button>
  	</div>
  `,
  components: {
    XIcon,
  },
  props: ['imageURL', 'username', 'text', 'date', 'isDeletable'],

  setup() {
    const deleteComment = () => {
      console.log('delete comment')
    }

    return {
      formatDistanceToNow,
      parseISO,
      deleteComment,
    }
  },
}
