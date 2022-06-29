import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Inicio',
    component: Home
  },
  {
    path: '/pelicula/:pref',
    name: 'Película',
    component: () => import('../views/MovieSingle.vue')
  },
  {
    path: '/admin',
    name: 'Admin',
    redirect: '/admin/banners'
  },
  {
    path: '/admin/:section',
    name: 'Admin Section',
    component: () => import('../views/Admin.vue')
  },
  {
    path: '/entradas/:fref',
    name: 'Entradas',
    component: () => import('../views/TicketsSelect.vue')
  },
  {
    path: '/pagar',
    name: 'Pagar',
    component: () => import('../views/Pay.vue')
  },
  {
    path: '/retiro',
    name: 'Retirar Entradas',
    component: () => import('../views/TicketsPickUp.vue')
  },
  {
    path: "/:pathMatch(.*)*",
    name: '404',
    component: function() {
        return import ('../views/404.vue')
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
