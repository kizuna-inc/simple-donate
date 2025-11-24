import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import InstallView from '@/views/InstallView.vue'

import LoginView from '@/views/BackOffice/LoginView.vue'

import ErrorView from '@/views/ErrorView.vue'

// =========================================================

import BackOfficeView from '@/views/BackOffice/BackOfficeView.vue'
import DashboardView from '@/views/BackOffice/SideView/DashboardView.vue'
import HistoryView from '@/views/BackOffice/SideView/HistoryView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/install',
      name: 'install',
      component: InstallView,
    },
    {
      path: '/admin',
      name: 'admin block',
      component: BackOfficeView,
      children: [
        {
          path: '',
          name: 'dashboard',
          component: DashboardView,
        },
        {
          path: 'history',
          name: 'transaction',
          component: HistoryView,
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/:pathMatch(.*)*', // Catch-all route for Vue Router 4
      name: 'error',
      component: ErrorView,
    },
  ],
})

export default router
