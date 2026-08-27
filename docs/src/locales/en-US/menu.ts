const menuLocales = {
  header: {
    home: 'Home',
    docs: 'Docs',
    components: 'Components',
    changelog: 'Changelog',
    playground: 'Playground',
  },

  docs: {
    introduce: 'Introduction',
    use: 'How to Use',
    gettingStarted: 'Getting Started',
    other: 'Others',
    faq: 'FAQ',
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
