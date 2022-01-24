import { useRoute } from '/modules/vue-router.js'
import { ref, watch } from '/modules/vue.js'
import HeaderOptions from '/src/components/header/HeaderOptions.js'
import HeaderSearch from '/src/components/header/HeaderSearch.js'
import { isAuthenticated } from '/src/store/userStore.js'
export default {
  template: `  
  	<div v-if="showHeader">
  		<div class="top-0 w-full h-16 bg-white border-b border-gray-300 z-10">
  			<div class="flex relative items-center justify-between h-full max-w-4xl px-4 mx-auto xl:px-0">
  				<RouterLink to="/" @click.native="scrollToTop()">
  					<img class="w-28" src="/src/assets/images/logo.png" />
  				</RouterLink>
  				<HeaderSearch class="flex mx-3 md:ml-28 relative" />
  				<HeaderOptions />
  			</div>
  		</div>
  	</div>
  `,
  components: {
    HeaderSearch,
    HeaderOptions,
  },

  setup() {
    const showHeader = ref(isAuthenticated.value)
    const route = useRoute()
    watch(
      () => route.name,
      () => (showHeader.value = isAuthenticated.value || route.name != 'home')
    )

    const scrollToTop = () =>
      document.getElementById('shell').scrollTo({
        top: 0,
        behavior: 'smooth',
      })

    return {
      showHeader,
      scrollToTop,
    }
  },
}
