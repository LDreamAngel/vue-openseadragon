import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "about" */ '@/views/Home.vue')
  },
  {
    path: '/openseadragon',
    name: 'Openseadragon',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '@/views/Openseadragon.vue')
  },
  {
    path: '/labelml',
    name: 'Labelml',
    redirect: { name: 'Fabric' },
    component: () => import('@/views/labelml/index.vue'),
    children: [
        {
            path: '/fabric',
            name: 'Fabric',
            component: () => import('@/views/labelml/Fabric.vue')
        }
        , {
            path: '/labelHome',
            name: 'LabelHome',
            component: () => import('@/views/labelml/Home.vue')
        }
        // , {
        //     path: '/labelEdit',
        //     name: 'LabelEdit',
        //     component: () => import('@/views/labelml/Editor.vue')
        // }
    ]
  },
  {
    path: '/websocket',
    name: 'Websocket',
    component: () => import(/* webpackChunkName: "about" */ '@/views/Websocket.vue')
  },
  {
    path: '/cropper',
    name: 'Cropper',
    component: () => import(/* webpackChunkName: "about" */ '@/views/Cropper.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  linkActiveClass: 'active',
  routes
})

export default router
