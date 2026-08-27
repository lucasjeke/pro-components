import { createRouter, createWebHistory } from 'vue-router'
import { waitForHashTarget, waitForStablePosition } from './hash-scroll'
import componentRoutes from './modules/components'
import demoRoutes from './modules/demos'
import { pagesRoutes } from './modules/pages'

const stopActiveHashScroll: (() => void) | null = null
const hashScrollRequestId = 0

const routes = [{
  path: '/root',
  name: 'ROOT_ROUTE',
  redirect: '/',
  component: () => import('@/layouts/base/root.vue'),
  children: [
    ...componentRoutes,
    ...pagesRoutes,
  ],
}, {
  path: '/~demos',
  redirect: '/~demos/affix-demo-basic',
  component: () => import('@/layouts/demo/index.vue'),
  children: demoRoutes,
}]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // 是否应该禁止尾部斜杠。默认为假
  strict: true,
  async scrollBehavior(to, _from, savedPosition) {
    // const requestId = ++hashScrollRequestId
    // stopActiveHashScroll?.()
    // stopActiveHashScroll = null

    // if (to.hash) {
    //   const targetId = decodeURIComponent(to.hash.slice(1))
    //   const element = await waitForHashTarget(targetId)
    //   if (requestId !== hashScrollRequestId)
    //     return false

    //   if (element) {
    //     stopActiveHashScroll = startHashScrollTracking(element, { offsetTop: 70 })
    //     return false
    //   }

    //   return { top: 0, left: 0 }
    // }
    // else if (savedPosition) {
    //   return {
    //     ...savedPosition,
    //     behavior: 'smooth',
    //   }
    // }
    // return { top: 0, left: 0 }
    if (to.hash) {
      const targetId = decodeURIComponent(to.hash.slice(1))
      const element = await waitForHashTarget(targetId)
      if (!element)
        return { top: 0, left: 0 }

      await waitForStablePosition(element)

      const headerHeight = 70
      const rect = element.getBoundingClientRect()
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const targetTop = rect.top + scrollTop - headerHeight
      return {
        left: 0,
        top: Math.max(targetTop, headerHeight),
        behavior: 'instant',
      }
    }
    else if (savedPosition) {
      return {
        ...savedPosition,
        behavior: 'smooth',
      }
    }
    return { top: 0, left: 0 }
  },
})

export default router
