import Header from '/src/components/header/Header.js'
export default {
  template: `  
  	<div class="w-screen min-h-screen bg-zinc-50">
  		<Header></Header>
  		<RouterView name="dialog-router" />
  		<RouterView v-slot="{ Component }">
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

  setup() {},
}
