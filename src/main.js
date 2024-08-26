import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import VueWechatTitle from 'vue-wechat-title'
import { createRouter, createWebHistory } from 'vue-router/auto'
import { routes } from 'vue-router/auto-routes'
 
const router = createRouter({
  history: createWebHistory(),
  routes
})
 


import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const app = createApp(App)
app.use(VueWechatTitle);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
app.use(ElementPlus)
app.use(router)
app.mount('#app')


