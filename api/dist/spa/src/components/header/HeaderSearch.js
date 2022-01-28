import SearchIcon from '/modules/@heroicons/vue/outline/SearchIcon.js'
import BadgeCheckIcon from '/modules/@heroicons/vue/solid/BadgeCheckIcon.js'
import ChevronDownIcon from '/modules/@heroicons/vue/solid/ChevronDownIcon.js'
import { ref, watch } from '/modules/vue.js'
import api from '/src/api/api.js'
import FriendsDialog from '/src/components/direct/FriendsDialog.js'
import FloatingInput from '/src/components/ui/FloatingInput.js'
import Input from '/src/components/ui/Input.js'
import Listbox from '/src/components/ui/Listbox.js'
import useDebouncedRef from '/src/components/utility/debounceRef.js'
import { isAuthenticated } from '/src/store/userStore.js'
const sortOptions = {
  'First Name': 'first-name',
  'Last Name': 'last-name',
  'Date of Birth': 'date-of-birth',
}
export default {
  template: `  
  	<div id="root" class="w-56 md:w-64">
  		<div
  			class="text-sm flex items-center px-3 transition border border-gray-100 rounded-md bg-gray-100"
  		>
  			<SearchIcon class="w-5 h-5 text-gray-600 cursor-text"></SearchIcon>
  			<input
  				type="text"
  				placeholder="Search"
  				class="w-full h-full border-0 focus:ring-0 placeholder:text-sm bg-gray-100"
  				v-model="query"
  			/>
  		</div>
  		<transition
  			enter-active-class="transition duration-200 ease-out"
  			enter-from-class="translate-y-1 opacity-0"
  			enter-to-class="translate-y-0 opacity-100"
  			leave-active-class="transition duration-150 ease-in"
  			leave-from-class="translate-y-0 opacity-100"
  			leave-to-class="translate-y-1 opacity-0"
  		>
  			<div
  				tabindex="1"
  				v-show="focused"
  				class="absolute -right-14 top-12 pb-0.5 shadow-lg bg-white z-10 w-[375px] divide-y border-t-0 divide-gray-300 rounded border border-gray-300"
  			>
  				<div class="absolute left-1/2 mx-auto w-4 h-4
  							-mt-2 mr-5 border-gray-300 rotate-45
  							bg-white rounded-sm border-t border-l ">
  				</div>
  				<div class="items-center p-5 pb-3 text-sm space-y-3 select-none">
  					<Listbox @change="value => sortBy = value" :values="Object.keys(sortOptions)" name="'Sort by'" :floating="true" placeholder="Sort by"></Listbox>
  					<details class="block">
  						 <summary 
  						 	@click="dateEnabled = !dateEnabled"
  							class="active:ring-0 max-w-fit flex space-x-1 text-[13px] cursor-pointer" 
  						>
  							<div>Date of Birth</div>
  								<ChevronDownIcon id="summary-chevron" class="h-5 w-5 transition"/>
  						 </summary >
  						 <div class=" flex space-x-2 justify-between pt-2 pb-1">
  							<FloatingInput
  							name="from"
  							placeholder="From"
  							type="date"
  							v-model="monthFrom"
  							class="flex-1"
  							:class="{ 'month-input--has-value': monthFrom }"
  							/>						
  							<FloatingInput
  							name="to"
  							placeholder="To"
  							type="date"
  							v-model="monthTo"
  							class="flex-1"
  							:class="{ 'month-input--has-value': monthTo }"
  							/>						
  						</div>
  					</details>
  				</div>
  				<div class="overflow-y-auto overscroll-contain max-h-72 py-2 text-[13px]">
  					<div v-for="user in users" :key="user.username">
  						<RouterLink @click.stop="focused=false" :to="{ name: 'profile', params: { username: user.username } }">
  							<div class="pl-4 pr-6 py-2 flex items-center justify-between space-x-3 hover:bg-gray-50 cursor-pointer">
  								<div class="flex items-center space-x-3">
  									<img :src="user.imageURL" alt="Profile picture" class="rounded-full w-10 h-10">
  									<div>
  										<div class="flex items-center space-x-1">
  												<div class="font-medium">{{ user.username }}</div>
  											<BadgeCheckIcon v-if="user.isAdmin" class="text-blue-500 w-5 h-5 "/>
  										</div>
  										<div class="flex -mt-0.5 text-gray-500 space-x-1 items-center">
  											<div class="">{{user.fullName}}</div>
  											<div v-if="user.isFriend" class="flex space-x-1 items-center">
  												<div class=" text-gray-300">&bull;</div>
  												<div>Friend</div>
  											</div>
  										</div>
  									</div>
  								</div>
  								<div class="text-gray-500 text-xs">{{user.dateOfBirth}}</div>
  							</div>
  						</RouterLink>
  					</div>
  				</div>
  			</div>
  		</transition>
  	</div>
  `,
  components: {
    SearchIcon,
    FriendsDialog,
    Listbox,
    Input,
    FloatingInput,
    BadgeCheckIcon,
    ChevronDownIcon,
  },

  setup() {
    const focused = ref(false)
    const dateEnabled = ref(false)
    const query = useDebouncedRef('', 200, true)
    const users = ref([])
    const monthFrom = ref('1950-01-01')
    const monthTo = ref('2022-01-01')
    const sortBy = ref(sortOptions[0])
    let data
    watch([query, dateEnabled, sortBy, monthFrom, monthTo], async () => {
      ;[data] = await api.users.search(
        query.value,
        dateEnabled.value ? monthFrom.value : null,
        dateEnabled.value ? monthTo.value : null,
        sortOptions[sortBy.value]
      )
      users.value = data
    })
    window.addEventListener('click', function (e) {
      if (
        document.getElementById('root') != null &&
        document.getElementById('root').contains(e.target)
      ) {
        if (!focused.value) focused.value = true
      } else {
        focused.value = false
      }
    })
    return {
      focused,
      sortOptions,
      dateEnabled,
      query,
      users,
      monthTo,
      monthFrom,
      sortBy,
      isAuthenticated,
    }
  },
}
