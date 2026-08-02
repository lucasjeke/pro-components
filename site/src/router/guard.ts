import type { Router } from 'vue-router'
import { applyRouteSeo } from '@/composables/seo.ts'
import { useAppStore } from '@/store/modules/app'
import { toCnPathname, toEnPathname } from '@/utils/locale-path'

export function setupRouterGuard(router: Router) {
  router.beforeEach(
    (to) => {
      // switch to CN & US
      const appStore = useAppStore()
      if (to.path.startsWith('/~demos')) {
        return true
      }
      const locale = appStore.locale
      if (locale === 'zh-CN' && to.path.includes('/en-US')) {
        const path = toCnPathname(to.path)
        return {
          ...to,
          replace: true,
          path,
        }
      }
      else if (locale === 'en-US' && !to.path.includes('/en-US')) {
        const path = toEnPathname(to.path)
        return {
          ...to,
          replace: true,
          path,
        }
      }
      return true
    },
  )

  router.afterEach((to) => {
    if (!to.path.startsWith('/~demos'))
      applyRouteSeo(to)
  })
}
