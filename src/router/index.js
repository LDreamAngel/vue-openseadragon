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
    path: '/cropper',
    name: 'Cropper',
    component: () => import(/* webpackChunkName: "about" */ '@/views/Cropper.vue')
  },
  {
    path: '/websocket',
    name: 'Websocket',
    component: () => import(/* webpackChunkName: "about" */ '@/views/Websocket.vue')
  },
  {
    path: '/openseadragon',
    name: 'Openseadragon',
    component: () => import(/* webpackChunkName: "about" */ '@/views/Openseadragon.vue')
  },
  {
    path: '',
    name: 'Labelml',
    redirect: { name: 'Test' },
    component: () => import(/* webpackChunkName: "Labelml" */ '@/views/labelml/index.vue'),
    children: [
        {
            path: '/labelml/test',
            name: 'Test',
            component: () => import(/* webpackChunkName: "Labelml" */ '@/views/labelml/test.vue')
        },{
          path: '/labelml/fabric',
          name: 'Fabric',
          component: () => import(/* webpackChunkName: "Labelml" */ '@/views/labelml/Fabric.vue')
        },{
          path: '/labelml/editor',
          name: 'Editor',
          component: () => import(/* webpackChunkName: "Labelml" */ '@/views/labelml/Editor.vue')
        },{
          path: '/labelml/Fabric_polygon',
          name: 'Fabric_Polygon',
          component: () => import(/* webpackChunkName: "Labelml" */ '@/views/labelml/Fabric_polygon.vue')
        },{
          path: '/labelml/airglass',
          name: 'Airglass',
          component: () => import(/* webpackChunkName: "Labelml" */ '@/views/labelml/airglass.vue')
        },{
          path: '/labelml/label_fabric',
          name: 'LabelFabric',
          component: () => import(/* webpackChunkName: "Labelml" */ '@/views/labelml/label_fabric.vue')
        },{
          path: '/labelml/label_opsd',
          name: 'LabelOpsd',
          component: () => import(/* webpackChunkName: "Labelml" */ '@/views/labelml/label_opsd.vue')
        }
    ]
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  linkActiveClass: 'active',
  routes
})

export default router
