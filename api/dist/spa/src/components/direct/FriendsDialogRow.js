import CheckIcon from '/src/icons/CheckIcon.js'
import EmptyCheckIcon from '/src/icons/EmptyCheckIcon.js'
export default {
  template: `  
  	<div 
  		@click="$emit('selected', username)"
  		class="hover:bg-gray-200 cursor-pointer select-none"
  	>
  		<div class="flex px-5 py-3 pr-6 items-center justify-between">
  			<div class="flex items-center justify-center space-x-3">
  				<img :src="imageURL" alt="Profile picture" class="rounded-full w-11 h-11 object-cover" />
  				<div>
  					<div class="font-medium">{{ username }}</div>
  					<div class="text-gray-500">{{ fullName }}</div>
  				</div>
  			</div>
  			<EmptyCheckIcon v-if="!isSelected" />
  			<CheckIcon v-else />
  		</div>
  	</div>
  `,
  components: {
    EmptyCheckIcon,
    CheckIcon,
  },
  props: ['imageURL', 'username', 'fullName', 'isSelected'],
}
