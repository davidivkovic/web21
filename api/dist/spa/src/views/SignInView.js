import { ref, shallowRef } from '/modules/vue.js'
import SignInPanel from '/src/components/signin/SignInPanel.js'
import SignUpPanel from '/src/components/signin/SignUpPanel.js'
import SuccessAlert from '/src/components/ui/alerts/SuccessAlert.js'
export default {
  template: `  
      <transition
          enter-active-class="transition-opacity duration-250"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-500"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
      >
  	<SuccessAlert v-if="success">Successfully registered</SuccessAlert>
  	</transition>
  	<div class="min-h-screen">
  		<div class="flex justify-center space-x-2 min-h-screen">
  			<div class="hidden lg:flex h-screen items-center">
  				<div class="relative">
  					<img src="/src/assets/images/phones.png" class="min-w-full h-min" />
  					<transition
  						enter-active-class="transition-opacity duration-1000"
  						enter-from-class="opacity-0"
  						enter-to-class="opacity-100"
  						leave-active-class="transition-opacity duration-1000"
  						leave-from-class="opacity-100"
  						leave-to-class="opacity-0"
  					>
  						<img
  							v-if="activeScreen === 0"
  							key="0"
  							src="/src/assets/images/screen1.jpg"
  							class="top-[6.25rem] right-[3.925rem] absolute"
  						/>
  						<img
  							v-else-if="activeScreen === 1"
  							key="1"
  							src="/src/assets/images/screen2.jpg"
  							class="top-[6.25rem] right-[3.925rem] absolute"
  						/>
  						<img
  							v-else-if="activeScreen === 2"
  							key="2"
  							src="/src/assets/images/screen3.jpg"
  							class="top-[6.25rem] right-[3.925rem] absolute"
  						/>
  						<img
  							v-else-if="activeScreen === 3"
  							key="3"
  							src="/src/assets/images/screen4.jpg"
  							class="top-[6.25rem] right-[3.925rem] absolute"
  						/>
  						<img
  							v-else
  							key="4"
  							src="/src/assets/images/screen5.jpg"
  							class="top-[6.25rem] right-[3.925rem] absolute"
  						/>
  					</transition>
  				</div>
  			</div>
  			<transition
  				mode="out-in"
  				enter-active-class="transition-opacity duration-50"
  				enter-from-class="opacity-0"
  				enter-to-class="opacity-100"
  				leave-active-class="transition-opacity duration-50"
  				leave-from-class="opacity-100"
  				leave-to-class="opacity-0"
  			>
  				<component 
  					:is="authPanel"
  					@switchAuth="switchAuth()"
  					@authSuccess="displaySuccess()"
  					class="self-center" />
  			</transition>
  		</div>
  	</div>
  `,
  name: 'sign-in',
  components: {
    SignInPanel,
    SignUpPanel,
    SuccessAlert,
  },

  setup() {
    const activeScreen = ref(0)
    const success = ref(false)
    const authPanel = shallowRef(SignInPanel)
    setInterval(() => (activeScreen.value = (activeScreen.value + 1) % 5), 4000)

    const switchAuth = () => {
      authPanel.value =
        authPanel.value === SignInPanel ? SignUpPanel : SignInPanel
    }

    const displaySuccess = () => {
      setTimeout(() => (success.value = true), 100)
      setTimeout(() => (success.value = false), 5000)
    }

    return {
      activeScreen,
      success,
      authPanel,
      switchAuth,
      displaySuccess,
    }
  },
}
