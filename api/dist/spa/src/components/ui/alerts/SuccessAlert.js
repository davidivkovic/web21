import CheckCircleIcon from '/modules/@heroicons/vue/solid/CheckCircleIcon.js'
import XIcon from '/modules/@heroicons/vue/solid/XIcon.js'
export default {
  template: `  
      <div
          class="rounded-md bg-green-50 p-4 mt-5 transition-all max-w-sm absolute right-0 left-0 mx-auto"
      >
          <div class="flex">
              <div class="flex-shrink-0">
                  <CheckCircleIcon class="h-5 w-5 text-green-400" aria-hidden="true" />
              </div>
              <div class="ml-3">
                  <p class="text-sm font-medium text-green-800">
                      <slot></slot>
                  </p>
              </div>
              <div class="ml-auto pl-3">
                  <div class="-mx-1.5 -my-1.5">
                      <button
                          type="button"
                          class="inline-flex bg-green-50 rounded-md p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600"
                      >
                          <span class="sr-only">Dismiss</span>
                          <XIcon class="h-5 w-5" aria-hidden="true" />
                      </button>
                  </div>
              </div>
          </div>
      </div>
  `,
  components: {
    CheckCircleIcon,
    XIcon,
  },
}
