
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VSnackbarQueue } from 'vuetify/labs/VSnackbarQueue'
import { VDateInput } from 'vuetify/labs/VDateInput'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth';
// Vuetify
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'

import './assets/main.css'
const app = createApp(App)

app.use(createPinia())

app.use(createVuetify({
    components: {
        VSnackbarQueue, VDateInput
    },

    locale: {
        locale: 'fa',
        fallback: 'en',
    },

    theme: {
        defaultTheme: 'light',
        themes: {
            light: {
                dark: false,
                colors: {
                    // background: '#f4f5fa', // Materio
                    background: '#f8f7fa', // Vuexy
                    primary: '#8C57FF', // Materio
                    // primary: '#7367f0', // Vuexy
                }
            }
        }
    },
}))

const auth = useAuthStore()
auth.fetchUser().then(() => {
    app.use(router);
    app.mount('#app')
})
