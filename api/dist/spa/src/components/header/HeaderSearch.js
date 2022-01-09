import SearchIcon from '/modules/@heroicons/vue/outline/SearchIcon.js'
export default {
  template: `  
  	<button
  		@click="openDropdown()"
  		class="flex items-center justify-center w-64 px-3 py-2 text-sm transition border border-gray-300 rounded-md hover:bg-gray-100"
  	>
  		<div class="flex items-center space-x-2">
  			<p>Search</p>
  			<search-icon class="w-5 h-5 text-gray-600"></search-icon>
  		</div>
  	</button>
  `,
  components: {
    SearchIcon,
  },

  setup() {
    const openDropdown = () => {}

    return {
      openDropdown,
    }
  },
}
