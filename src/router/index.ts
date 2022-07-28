import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Inicio',
    component: Home
  },
  {
    path: '/pelicula/:cinemaId:/:pref',
    name: 'Película',
    component: () => import('../views/MovieSingle.vue')
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/Admin.vue')
  },
  {
    path: '/entradas/:cinemaId/:fref',
    name: 'Entradas',
    component: () => import('../views/TicketsSelect.vue')
  },
  {
    path: '/pagar/:cinemaId/:salesId',
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
  history: process.env.IS_ELECTRON ? createWebHashHistory() : createWebHistory(),
  routes
})

export default router
