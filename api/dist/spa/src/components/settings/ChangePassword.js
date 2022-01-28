import { ref } from '/modules/vue.js'
import api from '/src/api/api.js'
import SuccessAlert from '/src/components/ui/alerts/SuccessAlert.js'
import Button from '/src/components/ui/Button.js'
import Input from '/src/components/ui/Input.js'
import { formData } from '/src/components/utility/forms.js'
import { user } from '/src/store/userStore.js'
const genders = ['Male', 'Female', 'Other']
export default {
  template: `  
  	<div class="ml-20 py-12 max-w-md w-full">
  		<div class="text-right">
  			<div class="flex items-end space-x-8 w-full">
  				<div class="w-1/4 flex justify-end -mb-[18px] ml-2">
  					<img :src="user.imageURL" alt="Profile picture" class="rounded-full w-10 h-10 "/>
  				</div>
  				<div class="text-lg ">{{user.username}}</div>
  			</div>
  			<form @submit.prevent="onSubmit" class="space-y-4">
  						<div class="w-full flex justify-end">
  				<div class="text-gray-600 text-left text-xs w-3/4 pl-10" >
  					<div class="font-semibold">Password change</div>
  					You will be prompted to log in again after changing your password.
  				</div>
  			</div>
  				<div class="flex space-x-10 items-center">
  					<aside class="w-1/4 font-medium">Old password</aside>
  					<Input name="oldPassword" class="!bg-white flex-1 text-sm h-9"/>
  				</div>
  					<div class="flex space-x-10 items-center">
  					<aside class="w-1/4 font-medium">New password</aside>
  					<Input name="newPassword" class="!bg-white flex-1 text-sm h-9"/>
  				</div>
  					<div class="flex space-x-10 items-center">
  					<aside class="w-1/4 font-medium">Confirm new password</aside>
  					<Input name="newPasswordAgain" class="!bg-white flex-1 text-sm h-9"/>
  				</div>
  				<div class="w-full flex justify-end">
  					<div class="w-3/4 pl-10" >
  						<Button class="float-left !px-4 bg-black text-white">Change password</Button>
  					</div>
  				</div>
  				<div class="w-full flex justify-end">
  					<div class="w-3/4 pl-10" >
  						<div :class="[success ? 'text-green-400' : 'text-red-500']" class="float-left" >{{formError}}</div>
  					</div>
  				</div>
  			</form>
  		</div>
  	</div>
  `,
  components: {
    Input,
    Button,
    SuccessAlert,
  },

  setup() {
    const formError = ref('')
    const success = ref(false)

    const onSubmit = async event => {
      var data = formData(event)

      if (data.newPassword != data.newPasswordAgain) {
        formError.value = 'Passwords do not match!'
        return
      }

      var [data, error] = await api.auth.changePassword(formData(event))
      formError.value = error

      if (error == null) {
        await api.auth.signOut()
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
