import App from './App.js'
import router from './router/index.js'
import { createApp } from '/modules/vue.js'

const app = createApp(App)

app.use(router)

app.mount('#app')
