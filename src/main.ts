import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'

//Tailwind
import './css/tailwind.css'

const app = createApp(App)

//detect electron
const userAgent = navigator.userAgent.toLowerCase();
if (userAgent.indexOf(' electron/') > -1) {
    app.config.globalProperties.kioskMode = true
}
else{
    app.config.globalProperties.kioskMode = false
}

app.config.globalProperties.apiUrl =    (process.env.NODE_ENV === 'production')
                                        ? window.location.protocol+'//api.gaf.adro.studio'
                                        : window.location.protocol+'//apiv1.gaf.local'
app.use(router).mount('#app')
