import Header from '/src/components/header/Header.js'
import { connectToChat } from '/src/store/chatStore.js'
export default {
  template: `  
  	<div class="flex flex-col w-screen h-screen bg-zinc-50">
  		<Suspense>
  			<Header></Header>
  		</Suspense>
  		<RouterView v-slot="{ Component }">
  			<Suspense>
  				<div 
  					id="shell"
  					style="overflow-y: overlay;"
  					class="flex-1 relative overscroll-contain"
  				>
  					<Component :is="Component"/>
  				</div>
  			</Suspense>
  		</RouterView>
  		<RouterView  v-slot="{ Component }" name="dialog-router" >
  			<Suspense>
  				<div>
  					<Component :is="Component"/>
  				</div>
  			</Suspense>
  		</RouterView>
  	</div>
  `,
  components: {
    Header,
  },

  setup() {
    connectToChat()
  },
}
