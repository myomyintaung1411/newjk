import Home from './views/Home.vue'
import NotFound from './views/NotFound.vue'
import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store/index'
/** @type {import('vue-router').RouterOptions['routes']} */
const routes = [
  {
    path: '/',
    component: Home,
    meta: { title: 'Home' },
    redirect:'/hjSystem',
    children: [

      {
        path: '/wholesysm',
        name: 'WholeSysm',
        component: () => import('./views/WholeSysm.vue'),
        meta: { title: 'WholeSysm' }
      },
      {
        path: '/hjSystem',
        name: 'hjSystem',
        component: () => import('./views/HjSystem.vue'),
        meta: { title: 'hjSystem' }
      },
      {
        path: '/winLoseQuery',
        name: 'winLoseQuery',
        component: () => import('./views/WinLoseQuery.vue'),
        meta: { title: 'winLoseQuery' }
      },
      {
        path: '/betCompare',
        name: 'betCompare',
        component: () => import('./views/BetCompare.vue'),
        meta: { title: 'betCompare' }
      },
      {
        path: '/summeryData',
        name: 'summeryData',
        component: () => import('./views/SummeryData.vue'),
        meta: { title: 'summeryData' }
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    meta: { title: 'Login' },
    // example of route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('./views/Login.vue')
  },



  { path: '/:path(.*)', redirect: '/login' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  const token = store.state.app.token
  // If logged in, or going to the Login page.
  if (token || to.name === 'Login') {
    // Continue to page.
    next()
  } else {
    // Not logged in, redirect to login.
    next({ name: 'Login' })
  }
});




export default router