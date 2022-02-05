import CogIcon from '/modules/@heroicons/vue/outline/CogIcon.js'
import LogoutIcon from '/modules/@heroicons/vue/outline/LogoutIcon.js'
import UserCircleIcon from '/modules/@heroicons/vue/outline/UserCircleIcon.js'
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '/modules/headlessui-vue.js'
import api from '/src/api/api.js'
import SettingsIcon from '/src/icons/SettingsIcon.js'
import { user } from '/src/store/userStore.js'
export default {
  template: `  
  	<Menu as="div" class="relative block text-left z-20" v-slot="{ open }">
  		<MenuButton
  			class="w-6 h-6 mt-0.5 rounded-full"
  			:class="{ 'outline outline-offset-1 outline-1': open }"
  		>
  			<img :src="user.imageURL" alt="Profile picture" class="w-6 h-6 rounded-full object-cover" />
  		</MenuButton>
  
  		<transition
  			enter-active-class="transition duration-100 ease-out"
  			enter-from-class="transform scale-95 opacity-0"
  			enter-to-class="transform scale-100 opacity-100"
  			leave-active-class="transition duration-75 ease-in"
  			leave-from-class="transform scale-100 opacity-100"
  			leave-to-class="transform scale-95 opacity-0"
  		>
  			<MenuItems
  				class="absolute w-56 mt-3 origin-top-right bg-white border border-gray-300 divide-y divide-gray-300 rounded-md shadow-lg -right-4"
  			>
  				<div class="flex flex-col">
  					<div
  						class="absolute top-0 right-0 w-4 h-4 float-left ml-1 -mt-2 mr-5 border-gray-300 rotate-45 bg-white rounded-sm border-t border-l"
  					></div>
  					<MenuItem v-slot="{ active }">
  						<RouterLink
  							:to="{ name: 'profile', params: { username: user.username } }"
  							class="space-x-0.5 z-20"
  							:class="[
  								active ? 'bg-gray-50' : 'text-gray-900',
  								'group flex items-center w-full mt-1 px-3.5 py-2 text-sm',
  							]"
  						>
  							<UserCircleIcon class="w-5 h-5 mr-2" aria-hidden="true" />
  							<p>Profile</p>
  						</RouterLink>
  					</MenuItem>
  					<MenuItem v-slot="{ active }">
  						<RouterLink :to="{name: 'settings'}">
  							<button
  								class="space-x-0.5"
  								:class="[
  									active ? 'bg-gray-50' : 'text-gray-900',
  									'group flex  items-center mt-0.5 mb-1 w-full px-3.5 py-2 text-sm',
  								]"
  							>
  								<CogIcon class="w-5 h-5 mr-2" aria-hidden="true" />
  								<p>Settings</p>
  							</button>
  						</RouterLink>
  					</MenuItem>
  				</div>
  				<div>
  					<MenuItem v-slot="{ active }">
  						<div
  							@click="api.auth.signOut()"
  							class="space-x-1 cursor-pointer"
  							:class="[
  								active ? 'bg-gray-50' : 'text-gray-900',
  								'group flex  items-center w-full px-3.5 py-2.5 text-sm',
  							]"
  						>
  							<LogoutIcon class="w-5 h-5 mr-2" aria-hidden="true" />
  							<p>Log Out</p>
  						</div>
  					</MenuItem>
  				</div>
  			</MenuItems>
  		</transition>
  	</Menu>
  `,
  props: ['imageURL'],
  components: {
    Menu,
    MenuButton,
    MenuItems,
    MenuItem,
    UserCircleIcon,
    CogIcon,
    SettingsIcon,
    LogoutIcon,
  },

  setup() {
    return {
      user,
      api,
    }
  },
}
