import { transformDate } from '/src/components/utility/dates.js'
export default {
  template: `  
  	<div class="flex items-center justify-between">
  		<RouterLink
  			as="div"
  			:to="'/' + request.sender.username" 
  			class="flex justify-start items-center space-x-3 cursor-pointer"
  		>
  			<img :src="request.sender.imageURL" class="rounded-full w-10 h-10" />
  			<div class="flex space-x-1">
  				<span class="font-medium">{{ request.sender.username }}
  				<span class="font-normal text-gray-900">
  					<slot name="text"></slot>
  					<span class="text-[13px] ml-1 text-black">
  						{{ transformDate(request.timestamp) }}
  					</span>
  				</span>
  				</span>
  			</div>
  		</RouterLink>
  		<slot name="buttons"></slot>
  	</div>
  `,
  props: ['request'],

  setup() {
    return {
      transformDate,
    }
  },
}
