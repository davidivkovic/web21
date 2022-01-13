import { getCurrentInstance, watch } from '/modules/vue.js'
export default {
  template: `  `,
  props: ['prop'],
  emits: ['change'],

  setup(props, { emit }) {
    const parent = getCurrentInstance().parent
    watch(
      () => props.prop,
      () => {
        emit('change', props.prop)
        parent.emit('change', props.prop)
      }
    )
  },
}
