import {
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from '/modules/headlessui-vue.js'
import ChangePassword from '/src/components/settings/ChangePassword.js'
import EditProfile from '/src/components/settings/EditProfile.js'
export default {
  template: `  
  	<div class="absolute left-0 right-0 h-full w-full md:pt-4 md:pb-5 text-sm">		
  		<div class="flex bg-white border md:border-zinc-300 
  				    rounded h-full md:max-w-[50rem] lg:max-w-4xl mx-auto"
  		>
  			<TabGroup>
  				<div class="basis-72 border-r border-gray-300">
  					<TabList>
  						<Tab v-slot="{selected}" class="w-full">
  							<button 
  								class="p-4 pl-8 hover:pl-[30px] w-full text-left hover:bg-gray-50"
  								:class="[
  									{'border-l-2 border-l-black  pl-[30px] font-semibold': selected},
  									{'hover:border-l-2 hover:border-l-gray-300':!selected}
  								]"
  							>
  								Edit Profile
  							</button>
  						</Tab>
  						<Tab v-slot="{selected}" class="w-full">
  							<button 
  								class="p-4 pl-8 hover:pl-[30px] w-full text-left hover:bg-gray-50"
  								:class="[
  									{'border-l-2 border-l-black pl-[30px] font-semibold': selected},
  									{'hover:border-l-2  hover:border-l-gray-300':!selected}
  								]"
  							>
  								Change Password
  							</button>
  						</Tab>
  					</TabList>
  				</div>
  				<TabPanel class="w-full">
  					<EditProfile/>
  				</TabPanel>
  				<TabPanel class="w-full">
  					<ChangePassword/>
  				</TabPanel>
  			</TabGroup>
  		</div>
  	</div>
  `,
  components: {
    TabGroup,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    EditProfile,
    ChangePassword,
  },
}
