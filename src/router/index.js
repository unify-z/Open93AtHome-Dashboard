import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '..homepage.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/:pathMatch(.*)*', 
      name: 'not-found',
      component: () => import('../homapage.vue') 
    }
  ]
})

export default router