import type { RouteRecordRaw } from 'vue-router'

export const pagesRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/pages/home/index.vue'),
  },
  {
    path: '/en-US',
    component: () => import('@/pages/home/index.vue'),
  },
  {
    path: '/sponsor',
    component: () => import('@/pages/sponsor/index.vue'),
    meta: {
      seo: {
        title: '赞助 ProComponents Vue',
        description: '支持 ProComponents Vue 的持续维护、文档建设与生态发展。',
        keywords: ['ProComponents Vue', '开源赞助', '捐赠'],
      },
    },
  },
  {
    path: '/en-US/sponsor',
    component: () => import('@/pages/sponsor/index.vue'),
    meta: {
      seo: {
        title: 'Sponsor ProComponents Vue',
        description: 'Support the maintenance, documentation, and ecosystem of ProComponents Vue.',
        keywords: ['ProComponents Vue', 'open source sponsorship', 'donation'],
      },
    },
  },
]
