import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router/auto'
import { routes } from 'vue-router/auto-routes'
 
const router = createRouter({
  history: createWebHistory(),
  routes
})
 
const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.mount('#app')


