export default {
  template: `  
  	<input
  		:value="modelValue"
  		@input="$emit('update:modelValue', $event.target.value)"
  		type="text"
  		spellcheck="false"
  		class="rounded-sm bg-neutral-50 border-gray-300 focus:ring-0 focus:border-gray-500 px-2.5 py-2.5 transition-colors placeholder-gray-400 w-full"
  	/>
  `,
  props: ['modelValue'],
  emits: ['update:modelValue'],
}
