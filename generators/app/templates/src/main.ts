import { createApp } from 'vue'
import App from './App.vue'
import { setupRouter } from './router'
import pinia from '@/stores/store'

const app = createApp(App)

// 挂载路由
setupRouter(app)

// 挂载Pinia
app.use(pinia)

app.mount('#app')