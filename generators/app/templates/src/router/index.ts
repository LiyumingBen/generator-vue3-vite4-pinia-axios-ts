import type { App } from 'vue'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const modules = import.meta.glob('./modules/**/*.ts', { eager: true, import: 'default' })

const moduleRoutes: RouteRecordRaw[] = []

Object.keys(modules).forEach((key: any) => {
  const mod = modules[key] || {}
  const modList = Array.isArray(mod) ? [...mod] : [mod]
  moduleRoutes.push(...modList)
})

// 动态加载路由 TODO
export const asyncRoutes = [...moduleRoutes]

const constantRoutes = [
  {
    path: '/',
    name: 'home',
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/home/index.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...constantRoutes, ...asyncRoutes],
})

export function setupRouter(app: App) {
  app.use(router)
}

export default router
