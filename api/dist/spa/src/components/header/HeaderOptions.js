import HeaderNewPostDialog from './HeaderNewPostDialog.js'
import HeaderNotificationsPopover from './HeaderNotificationsPopover.js'
import HeaderProfileMenu from './HeaderProfileMenu.js'
import { useRoute } from '/modules/vue-router.js'
import { computed, ref } from '/modules/vue.js'
import Button from '/src/components/ui/Button.js'
import Modal from '/src/components/ui/Modal.js'
import HomeIconOutline from '/src/icons/HomeIconOutline.js'
import HomeIconSolid from '/src/icons/HomeIconSolid.js'
import InboxIconOutline from '/src/icons/InboxIconOutline.js'
import InboxIconSolid from '/src/icons/InboxIconSolid.js'
import NewPostIconOutline from '/src/icons/NewPostIconOutline.js'
import NewPostIconSolid from '/src/icons/NewPostIconSolid.js'
import { isDialogOpen } from '/src/store/dialogStore.js'
import { isAuthenticated, user } from '/src/store/userStore.js'
export default {
  template: `  
  	<div v-if="isAuthenticated" class="flex space-x-5">
  		<RouterLink to="/" v-slot="{ isActive }" class="mt-0.5">
  			<HomeIconSolid v-if="isButtonActive(isActive, 'home')" />
  			<HomeIconOutline v-else />
  		</RouterLink>
  		<RouterLink to="/direct" v-slot="{ isActive }" class="mt-0.5">
  			<InboxIconSolid v-if="isButtonActive(isActive, 'direct')" />
  			<InboxIconOutline v-else />
  		</RouterLink>
  		<RouterLink to="/create" class="mt-0.5">
  			<NewPostIconSolid v-if="isDialogOpen && !isPopoverOpen" />
  			<NewPostIconOutline v-else />
  		</RouterLink>
  		<HeaderNotificationsPopover @change="e => popoverChanged(e)" />
  		<HeaderProfileMenu :imageURL="user.imageURL" />
  	</div>
  	<div v-else class="space-x-1">
  		<Button class="font-medium text-white bg-black">Log In</Button>
  		<Button class="font-medium text-black bg-white">Sign Up</Button>
  	</div>
  `,
  components: {
    HomeIconOutline,
    HomeIconSolid,
    InboxIconOutline,
    InboxIconSolid,
    NewPostIconOutline,
    NewPostIconSolid,
    Button,
    HeaderNotificationsPopover,
    HeaderProfileMenu,
    Modal,
    HeaderNewPostDialog,
  },

  setup() {
    const route = useRoute()
    const isPopoverOpen = ref(false)
    const backgroundView = computed(() => {
      if (route.name === 'create') {
        return route.matched[0].components.default.name
      }
    })

    const isButtonActive = (isRouteActive, viewName) => {
      return (
        (isRouteActive && !isPopoverOpen.value) ||
        (backgroundView.value === viewName && !isDialogOpen.value)
      )
    }

    const popoverChanged = open => (isPopoverOpen.value = open)

    return {
      user,
      backgroundView,
      isAuthenticated,
      isPopoverOpen,
      isDialogOpen,
      isButtonActive,
      popoverChanged,
    }
  },
}
