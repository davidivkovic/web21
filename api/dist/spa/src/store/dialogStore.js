import { ref, watch } from '/modules/vue.js'
import router, { dialogNames } from '/src/router/index.js'

// generalize dialog for profile pictures

const isDialogOpen = ref(false)

watch(
  () => router.currentRoute.value.name,
  () => {
    if (dialogNames.includes(router.currentRoute.value.name)) {
      isDialogOpen.value = true
    }
  }
)

const closeDialog = () => {
  isDialogOpen.value = false
}

export { isDialogOpen, closeDialog }
