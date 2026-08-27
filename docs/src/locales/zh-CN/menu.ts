const menuLocales = {
  header: {
    home: '首页',
    docs: '文档',
    components: '组件',
    changelog: '更新日志',
    playground: 'Playground',
  },

  docs: {
    gettingStarted: '快速上手',
    introduce: '介绍',
    use: '如何使用',
    other: '其他',
    faq: '常见问题',
  },

  changelog: {
    proComponents: 'ProComponents',
    proForm: 'ProForm',
    proTable: 'ProTable',
    proLayout: 'ProLayout',
    proCard: 'ProCard',
    proDescriptions: 'ProDescriptions',
    proField: 'ProField',
    proListy: 'ProListy',
    proProvider: 'ProProvider',
    proSkeleton: 'ProSkeleton',
    proUtils: 'ProUtils',
    routeUtils: 'RouteUtils',
  },
} as const

export default menuLocales

type DeepStringLeaves<T>
  = T extends string ? string
    : T extends Record<PropertyKey, any>
      ? { [K in keyof T]: DeepStringLeaves<T[K]> }
      : never

export type Menu = DeepStringLeaves<typeof menuLocales>
