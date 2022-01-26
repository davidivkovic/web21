import { ref } from '/modules/vue.js'
import api from '/src/api/api.js'
import SuccessAlert from '/src/components/ui/alerts/SuccessAlert.js'
import Button from '/src/components/ui/Button.js'
import Input from '/src/components/ui/Input.js'
import Listbox from '/src/components/ui/Listbox.js'
import { formData } from '/src/components/utility/forms.js'
import { user } from '/src/store/userStore.js'
const genders = ['Male', 'Female', 'Other']
export default {
  template: `  
  	<div class="ml-20 py-12 max-w-md">
  		<div class="flex items-center space-x-8 w-full">
  			<div class="w-1/4 flex justify-end -mb-6 ml-2">
  				<img :src="user.imageURL" alt="Profile picture" class="rounded-full w-10 h-10"/>
  			</div>
  			<div class="text-lg -ml-2">{{user.username}}</div>
  		</div>
  		<form @submit.prevent="onSubmit" class="text-right space-y-5">
  			<div class="w-full flex justify-end">
  				<div class="text-gray-600 text-left text-xs w-3/4 pl-10" >
  					<div class="font-semibold">Public Information</div>
  					This information is part of your public profile and anyone can see it.
  				</div>
  			</div>
  			<div class="flex space-x-10 items-center">
  				<aside class="w-1/4 font-medium">Name</aside>
  				<Input v-model="user.fullName" name="fullName" class="flex-1 text-sm h-[38px] !bg-white"/>
  			</div>
  			<div class="flex space-x-10 items-center">
  				<aside class="w-1/4 font-medium">Email</aside>
  				<Input v-model="user.email" name="email" class="flex-1 text-sm h-[38px] !bg-white"/>
  			</div>
  			<div>
  				<div class="flex space-x-10 items-center">
  					<aside class="w-1/4 font-medium">Private</aside>
  					<input type="checkbox" v-model="user.isPrivate" name="isPrivate" class="w-5 h-5 border-gray-300 rounded-sm focus:ring-transparent text-black "/>
  				</div>
  				<div class="w-full flex justify-end mt-2">
  					<div class="text-gray-600 text-left text-xs w-3/4 pl-10" >
  					When your account is private, only people you approve can see your photos on Instagram. Your existing followers won't be affected.
  					</div>
  				</div>
  			</div>
  			<div class="w-full flex justify-end">
  				<div class="text-gray-600 text-left text-xs w-3/4 pl-10" >
  					<div class="font-semibold">Private Information</div>
  					Provide your personal information. This won't be a part of your public profile.
  				</div>
  			</div>
  			<div class="flex space-x-10 items-center">
  				<aside class="w-1/4 font-medium">Gender</aside>
  				<Listbox 
  					id="settings-gender"
  					name="gender"
  					placeholder="Gender"
  					:floating="false"
  					:values="genders"
  					:default="user.gender"
  					class="flex-1 !text-base !bg-white"
  				/>
  			</div>
  			<div class="flex space-x-10 items-center">
  				<aside class="w-1/4 font-medium">Birthday</aside>
  				<Input type="date" v-model="user.dateOfBirth" name="dateOfBirth" class="flex-1 text-sm border !bg-white border-gray-300 h-[38px]"/>
  			</div>
  			<div class="w-full flex justify-end">
  				<div class="w-3/4 pl-10" >
  					<Button class="float-left !px-5 bg-black text-white">Submit</Button>
  				</div>
  			</div>
  			<div class="w-full flex justify-end">
  				<div class="w-3/4 pl-10" >
  					<div :class="[success ? 'text-green-400' : 'text-red-400']" class="float-left" >{{formError}}</div>
  				</div>
  			</div>
  		</form>
  	</div>
  `,
  components: {
    Listbox,
    Input,
    Button,
    SuccessAlert,
  },

  setup() {
    const formError = ref('')
    const success = ref(false)

    const onSubmit = async event => {
      const data = formData(event)
      data.isPrivate = data.isPrivate == 'on'
      const [_, error] = await api.users.editProfile(data)

      if (error == null) {
        formError.value = 'Profile successfuly updated.'
        success.value = true
      } else {
        formError.value = error
        success.value = false
      }
    }

    return {
      user,
      genders,
      onSubmit,
      formError,
      success,
    }
  },
}
