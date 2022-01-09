import HeaderOptions from '/src/components/header/HeaderOptions.js'
import HeaderSearch from '/src/components/header/HeaderSearch.js'
import { isAuthenticated } from '/src/store/userStore.js'
export default {
  template: `  
  	<div v-if="showHeader" class="py-8">
  		<div class="fixed top-0 w-full h-16 bg-white border-b border-gray-300 z-10">
  			<div class="flex relative items-center justify-between h-full max-w-4xl px-4 mx-auto xl:px-0">
  				<RouterLink to="/">
  					<img class="w-28" src="/src/assets/images/logo.png" />
  				</RouterLink>
  				<HeaderSearch class="absolute left-0 right-0 mx-auto" />
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
    const showHeader = isAuthenticated.value
    return {
      showHeader,
    }
  },
}
