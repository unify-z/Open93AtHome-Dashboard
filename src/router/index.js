import homepage from './homepage.vue'
import { createRouter, createWebHistory } from 'vue-router'
import Rank from './rank.vue' 
import Login from './login.vue'
import mycluster from './mycluster.vue'
const routes = [
  { path: '/', component: homepage},
  { path: '/rank', component: Rank},
  { path: '/auth/login', component: Login} ,
  { path: '/my/clusters', component: mycluster}
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})
export default router