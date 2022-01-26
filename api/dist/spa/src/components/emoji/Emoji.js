export default {
  template: `  
  	<button class="rounded pb-1 pr-1 duration-100 hover:bg-gray-200" @click="onClick">
  		<div :class="classes" v-html="emoji" />
  	</button>
  `,
  props: {
    classes: {
      type: String,
      default: 'w-8 h-8 p-0.5',
    },
    emoji: {
      type: String,
      default: '✨',
    },
  },
  emits: ['tapped'],

  setup(props, { emit }) {
    const onClick = () => {
      emit('tapped')
    }

    return {
      onClick,
    }
  },
}
