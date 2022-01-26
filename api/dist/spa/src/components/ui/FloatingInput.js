import { ref } from '/modules/vue.js'
export default {
  template: `  
      <div class="flex p-0 m-0 border-none relative">
          <input
  			ref="input"
  			v-bind="$attrs"
  			:value="modelValue"
  			@input="$emit('update:modelValue', $event.target.value)"
  			spellcheck="false"
  			class="peer rounded-sm bg-neutral-50 border border-gray-300 focus:ring-0
  				   focus:border-gray-500 px-2 py-2.5 transition-colors
  				   placeholder-gray-400 w-full text-xs placeholder-transparent
  				   placeholder-shown:py-2.5 pb-1 pt-4 focus-visible:outline-none"
  		/>
          <label 
              :for="$attrs.id"
              @click="input.focus()"
              class="peer-placeholder-shown:top-[11.5px] peer-placeholder-shown:text-xs
                     peer-placeholder-shown:text-gray-400 text-gray-400 cursor-default 
                     transition-all absolute left-0 px-[9.5px] top-0 text-[10px]
                     peer-placeholder-shown:cursor-text duration-100"
          >
          	{{$attrs.placeholder}}
          </label>
      </div>
  `,
  props: ['modelValue', 'label'],
  emits: ['update:modelValue'],

  setup() {
    const input = ref()
    return {
      input,
    }
  },
}
