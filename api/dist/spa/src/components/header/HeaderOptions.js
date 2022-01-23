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
import { unreadCount } from '/src/store/chatStore.js'
import { isDialogOpen } from '/src/store/dialogStore.js'
import { isAuthenticated, user } from '/src/store/userStore.js'
export default {
  template: `  
  	<div v-if="isAuthenticated" class="flex space-x-5">
  		<RouterLink to="/" @click="scrollToTop()" v-slot="{ isActive }" class="mt-0.5">
  			<HomeIconSolid v-if="isButtonActive(isActive, 'home')" />
  			<HomeIconOutline v-else />
  		</RouterLink>
  		<RouterLink to="/direct" v-slot="{ isActive }" class="mt-0.5 relative">
  			<div 
  				v-if="unreadCount > 0"
  				class="absolute flex items-center justify-center
  					   text-white text-[11px] w-[18px] h-[18px] bg-[#ee4957]
  					   rounded-full -right-1.5 -top-1.5"
  			>
  				{{ unreadCount }}
  			</div>
  			<InboxIconSolid v-if="isButtonActive(isActive, 'direct')" />
  			<InboxIconOutline v-else />
  		</RouterLink>
  		<RouterLink v-slot="{ isActive }" to="/create" class="mt-0.5">
  			<NewPostIconSolid v-if="isButtonActive(isActive, 'create')" />
  			<NewPostIconOutline v-else />
  		</RouterLink>
  		<HeaderNotificationsPopover @change="e => popoverChanged(e)" />
  		<HeaderProfileMenu :imageURL="user.imageURL" />
  	</div>
  	<div v-else class="space-x-1">
  		<RouterLink to="/">
  			<Button class="font-medium text-white bg-black">Log In</Button>
  		</RouterLink>
  		<RouterLink to="/">
  			<Button class="font-medium text-black bg-white">Sign Up</Button>
  		</RouterLink>
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

    const popoverChanged = open => {
      isPopoverOpen.value = open
    }

    const scrollToTop = () =>
      document.getElementById('shell').scrollTo({
        top: 0,
        behavior: 'smooth',
      })

    return {
      user,
      backgroundView,
      isAuthenticated,
      isPopoverOpen,
      isDialogOpen,
      isButtonActive,
      popoverChanged,
      scrollToTop,
      unreadCount,
    }
  },
}
