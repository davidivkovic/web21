import { ref } from '/modules/vue.js'
import api from '/src/api/api.js'
import Button from '/src/components/ui/Button.js'
import FloatingInput from '/src/components/ui/FloatingInput.js'
import Input from '/src/components/ui/Input.js'
import Listbox from '/src/components/ui/Listbox.js'
import { formData } from '/src/components/utility/forms.js'
import FacebookIcon from '/src/icons/FacebookIcon.js'
const genders = ['Male', 'Female', 'Other']
export default {
  template: `  
  	<div class="text-sm py-8">
  		<div class="flex flex-col items-center pb-4 mx-auto bg-white border w-[350px]">
  			<div class="w-64">
  				<img class="mx-auto mt-6 w-44" src="/src/assets/images/logo.png" />
  				<p
  					class="text-base text-gray-400 text-center mt-2 font-medium"
  				>Sign up to see photos and videos from your friends.</p>
  				<Button class="mt-4 bg-[#4267B2] text-white w-full font text-sm">
  					<div class="flex space-x-2 items-center justify-center">
  						<FacebookIcon class="w-4 h-4 text-white" />
  						<p>Log in with Facebook</p>
  					</div>
  				</Button>
  				<div class="relative mt-4">
  					<div class="absolute inset-0 flex items-center" aria-hidden="true">
  						<div class="w-full border-t border-gray-300" />
  					</div>
  					<div class="relative flex justify-center">
  						<span class="px-2 font-medium text-gray-400 bg-white">or</span>
  					</div>
  				</div>
  				<form class="mt-5 relative space-y-2" @submit.prevent="onSubmit">
  					<FloatingInput
  						name="email"
  						autocomplete="email"
  						placeholder="Email"
  						type="email"
  						required
  						
  					/>
  					<FloatingInput
  						name="fullName"
  						autocomplete="name"
  						placeholder="Full Name"
  						required
  					/>
  					<div class="flex items-center space-x-1">
  						<div class="w-3/5">
  							<FloatingInput
  								placeholder="Date of birth"
  								name="dateOfBirth"
  								type="date"
  								v-model="dateOfBirth"
  								:class="{ 'date-input--has-value': dateOfBirth }"
  								required
  							/>
  						</div>
  						<Listbox name="gender" placeholder="Gender" :floating="true" :values="genders" class="flex-1" />
  					</div>
  					<FloatingInput
  						id="username"
  						name="username"
  						autocomplete="username"
  						placeholder="Username"
  						required
  					/>
  					<div class="relative mt-2">
  						<FloatingInput
  							:type="isPasswordVisible ? 'text' : 'password'"
  							id="password"
  							name="password"
  							autocomplete="new-password"
  							placeholder="Password"
  							required
  							v-model="password"
  						/>
  						<button
  							type="button"
  							@click="isPasswordVisible = !isPasswordVisible"
  							class="absolute right-3 inset-y-2 bg-gray-50 text-neutral-700 active:text-neutral-500 font-medium text-[13px]"
  						>{{ isPasswordVisible ? 'Hide' : 'Show' }}</button>
  					</div>
  
  					<Button type="submit" class="w-full mt-4 text-white bg-black">Sign Up</Button>
  				</form>
  				<p v-if="formError" class="pt-4 text-red-500 text-[13px] leading-4 text-center">
  					{{formError}}
  				</p>
  				<p class="mt-5 text-center text-xs text-gray-400 tracking-tight leading-5">
  					By signing up, you agree to our
  					<span class="font-medium">Terms</span>,
  					<span class="font-medium">Data Policy</span> and
  					<span class="font-medium">Cookie Policy</span>.
  				</p>
  			</div>
  		</div>
  		<div class="flex flex-col items-center mx-auto bg-white border w-[350px] mt-3 py-6">
  			<p class="text-gray-700">
  				Have an account?
  				<button
  					class="font-semibold text-blue-400 transition hover:text-blue-300"
  					@click="$emit('switchAuth')"
  				>Log In</button>
  			</p>
  		</div>
  		<p class="mt-5 text-center text-gray-700">Get the app.</p>
  		<div class="flex items-center justify-center mt-5 space-x-2">
  			<img class="w-32 h-10" src="/src/assets/images/store1.png" />
  			<img class="w-32 h-10 h-" src="/src/assets/images/store2.png" />
  		</div>
  	</div>
  `,
  components: {
    Input,
    FloatingInput,
    Button,
    Listbox,
    FacebookIcon,
  },
  emits: ['switchAuth', 'authSuccess'],

  setup(props, { emit }) {
    const dateOfBirth = ref()
    const isPasswordVisible = ref(false)
    const password = ref('')
    const formError = ref()

    const onSubmit = async event => {
      const [data, error] = await api.auth.register(formData(event))
      formError.value = error

      if (!error) {
        emit('switchAuth')
        emit('authSuccess')
      }
    }

    return {
      dateOfBirth,
      password,
      genders,
      isPasswordVisible,
      formError,
      onSubmit,
    }
  },
}
