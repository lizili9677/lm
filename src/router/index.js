import { createRouter, createWebHistory } from 'vue-router';

import App from '@/App'
import Index from '@/views/index'
import Main from '@/views/main'
import _404 from '@/views/404'
import store from "@/store";
import {initGlobalState} from "@/common/util";

const routes = [
  {
    path: '/',
    name: 'index',
    component: Index
    // meta: { title: 'index' }
  },
  {
    path: '/linmo',
    name: 'linmo',
    component: Main
    // meta: { title: 'linmo'}
  },
  {
    path: '/404',
    name: '404',
    component: _404
    // meta: { title: '404'}
  }
]
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  if (store.getters.root) {
    next()
  } else {
    initGlobalState().then(r => {
      console.log('router go next')
      next()
    })
  }
})

export default router
