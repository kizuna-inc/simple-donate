import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import InstallView from '@/views/InstallView.vue'

import LoginView from '@/views/BackOffice/LoginView.vue'

import ErrorView from '@/views/ErrorView.vue'

// =========================================================

import BackOfficeView from '@/views/BackOffice/BackOfficeView.vue'
import DashboardView from '@/views/BackOffice/SideView/DashboardView.vue'
import HistoryView from '@/views/BackOffice/SideView/HistoryView.vue'
import ConfigView from '@/views/BackOffice/SideView/ConfigView.vue'

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
          name: 'admin dashboard',
          component: DashboardView,
        },
        {
          path: 'history',
          name: 'admin history',
          component: HistoryView,
        },
        {
          path: 'config',
          name: 'admin config',
          component: ConfigView,
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

// Route Protection
router.beforeEach(async (to, _from) => {
  if (new RegExp(/admin [a-zA-Z]+/gm).test(String(to.name))) {
    if (
      window.sessionStorage.getItem('token') === null ||
      window.sessionStorage.getItem('token') === undefined
    ) {
      return { name: 'login' }
    }
  } else if (to.name === 'login') {
    if (
      window.sessionStorage.getItem('token') !== null &&
      window.sessionStorage.getItem('token') !== undefined
    ) {
      return { name: 'admin dashboard' }
    }
  }
})

export default router
