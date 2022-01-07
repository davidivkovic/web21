import { ref } from '/modules/vue.js'
import api from '/src/api/api.js'
import Button from '/src/components/ui/Button.js'
import FloatingInput from '/src/components/ui/FloatingInput.js'
import { formData } from '/src/components/utility/forms.js'
import FacebookIcon from '/src/icons/FacebookIcon.js'
export default {
  template: `  
  	<div class="text-sm">
  		<div class="flex flex-col items-center pb-4 mx-auto bg-white border w-[350px]">
  			<div class="w-64">
  				<img class="mx-auto mt-7 w-44 mb-7" src="/src/assets/images/logo.png" />
  				<form @submit.prevent="onSubmit" class="relative">
  					<FloatingInput
  						name="username"
  						id="username"
  						placeholder="Username"
  						autocomplete="username"
  						required
  					/>
  					<div class="relative mt-2">
  						<FloatingInput
  							:type="isPasswordVisible ? 'text' : 'password'"
  							name="password"
  							id="password"
  							autocomplete="current-password"
  							type="password"
  							v-model="password"
  							placeholder="Password"
  							required
  						/>
  						<button
  							type="button"
  							@click="isPasswordVisible = !isPasswordVisible"
  							class="absolute right-3 inset-y-2 bg-gray-50 text-neutral-700 active:text-neutral-500 font-medium text-[13px]"
  						>{{ isPasswordVisible ? 'Hide' : 'Show' }}</button>
  					</div>
  					<Button class="w-full mt-4 text-white bg-black">Log In</Button>
  				</form>
  				<div class="relative mt-4">
  					<div class="absolute inset-0 flex items-center" aria-hidden="true">
  						<div class="w-full border-t border-gray-300" />
  					</div>
  					<div class="relative flex justify-center">
  						<span class="px-2 font-medium text-gray-400 bg-white">or</span>
  					</div>
  				</div>
  				<div class="flex items-center justify-center w-full mt-6 space-x-2 font-medium">
  					<FacebookIcon class="w-4 h-4 text-[#4267B2]" />
  					<a href class="text-[#385185]">Log in with Facebook</a>
  				</div>
  				<p v-if="formError" class="pt-4 text-red-500 text-[13px] leading-4 text-center">
  					{{formError}}
  				</p>
  				<p class="mt-5 text-xs text-center text-gray-700">
  					<a href>Forgotten your password?</a>
  				</p>
  			</div>
  		</div>
  		<div class="flex flex-col items-center mx-auto bg-white border w-[350px] mt-3 py-6">
  			<p class="text-gray-700">
  				Don't have an account?
  				<button
  					class="font-semibold text-blue-400 transition hover:text-blue-300"
  					@click="$emit('switchAuth')"
  				>Sign up</button>
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
    FloatingInput,
    Button,
    FacebookIcon,
  },
  emits: ['switchAuth'],

  setup() {
    const isPasswordVisible = ref(false)
    const password = ref('')
    const formError = ref()

    const onSubmit = async event => {
      const [data, error] = await api.auth.signIn(formData(event))
      formError.value = error
    }

    return {
      password,
      isPasswordVisible,
      formError,
      onSubmit,
    }
  },
}
