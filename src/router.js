import Vue from 'vue'
import Router from 'vue-router'
import index from './views/index.vue'
import fate from './views/fate.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      name: 'index',
      component: index
    },
    {
      path: '/fate',
      name: 'fate',
      component: fate
    }
  ]
})
