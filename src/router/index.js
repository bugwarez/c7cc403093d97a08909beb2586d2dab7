import { createRouter, createWebHistory } from 'vue-router'

//!Views
import HomeView from '../views/HomeView.vue'
import CurrencyConversionView from '../views/CurrencyConversionView.vue'
import CurrencyTimeSeriesView from '../views/CurrencyTimeSeriesView.vue'
import HistoryView from '../views/HistoryView.vue'

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
      name: 'CurrencyConversion',
      component: CurrencyConversionView
    },
    {
      path: '/currency-time-series',
      name: 'CurrencyTimeSeries',
      component: CurrencyTimeSeriesView
    },
    {
      path: '/history',
      name: 'HistoryView',
      component: HistoryView
    }
  ]
})

export default router
