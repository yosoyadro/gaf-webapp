import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'

//storage
import storage from './storage'

//Tailwind
import './css/tailwind.css'

const app = createApp(App)

//set storage
app.config.globalProperties.$store = storage;

//detect electron
app.config.globalProperties.kioskMode = process.env.IS_ELECTRON ? true : false

app.config.globalProperties.apiUrl =    (process.env.NODE_ENV === 'production')
                                        ? window.location.protocol+'//api.gaf.adro.studio'
                                        : window.location.protocol+'//apiv1.gaf.local'
app.use(router).mount('#app')
