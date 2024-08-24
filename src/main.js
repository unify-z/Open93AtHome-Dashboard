import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import homepage from './homepage.vue'
import { createRouter, createWebHistory } from 'vue-router'
import Rank from './rank.vue' 
import Login from './login.vue'
import VueWechatTitle from 'vue-wechat-title'
import mycluster from './mycluster.vue'
const routes = [
  { path: '/', component: homepage ,meta: {title: '主页|93@Home-Dash'}},
  { path: '/rank', component: Rank,meta: {title: '排行榜|93@Home-Dash'} },
  { path: '/auth/login', component: Login ,meta: {title: '登录|93@Home-Dash'}} ,
  { path: '/my/clusters', component: mycluster ,meta: {title: '我的节点|93@Home-Dash'}}
]
const router = createRouter({
  history: createWebHistory(),
  routes,
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


