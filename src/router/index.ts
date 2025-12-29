import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

/**
 * 路由配置
 * 主包作为微前端容器，加载所有子应用
 */
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {
      title: '工作台',
    },
  },
  {
    path: '/account',
    name: 'Account',
    component: () => import('../views/AccountContainer.vue'),
    meta: {
      title: '账号中心',
      isMicroApp: true, // 标记为微应用路由
    },
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/AdminContainer.vue'),
    meta: {
      title: '管理后台',
      isMicroApp: true, // 标记为微应用路由
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 路由守卫 - 设置页面标题
router.beforeEach((to, _from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
  next()
})

export default router
