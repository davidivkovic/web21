import { ref, watch } from '/modules/vue.js'
import router, { dialogNames } from '/src/router/index.js'
const isDialogOpen = ref(false)
const defaultRoute = ref('')
watch(
  () => router.currentRoute.value,
  (route, previousRoute) => {
    if (dialogNames.includes(route.name)) {
      isDialogOpen.value = true
      defaultRoute.value = previousRoute.name
    }
  },
  {
    immediate: true,
  }
)

const closeDialog = () => {
  isDialogOpen.value = false
  setTimeout(() => {
    if (defaultRoute.value == undefined) router.push('/')
    else router.back()
  }, 100) // transition duration
}

export { isDialogOpen, defaultRoute, closeDialog }
