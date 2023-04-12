import { createRouter, createWebHistory } from 'vue-router'

//!Views
import HomeView from '../views/HomeView.vue'
import CurrencyConversionView from '../views/CurrencyConversionView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/currency-conversion',
      name: 'currency-conversion',
      component: CurrencyConversionView
    }
  ]
})

export default router
