const menuLocales = {
  header: {
    docs: {
      vue: '文档',
    },
    components: '组件',
    blog: '博客',
    resources: '资源',
    playground: 'Playground',
  },

  docs: {
    vue: {
      introduce: '介绍',
      use: '如何使用',
      gettingStarted: '快速上手',
      ai: 'AI',
      llms: 'LLMs.txt',
      skills: 'Skills',
      nuxt: 'Nuxt',
      advancedUse: '进阶使用',
      secondaryDevelopment: '二次开发',
      unocss: 'UnoCSS',
      tailwindcss: 'Tailwind CSS',
      customizeTheme: '定制主题',
      compatibleStyle: '样式兼容',
      i18n: '国际化',
      commonProps: '通用属性',
      other: '其他',
      awesome: '社区生态',
      contributing: '贡献指南',
      releaseProcess: '提交与发布流程',
      faq: '常见问题',
    },
  },

  blog: {
    proComponentsRelease: 'ProComponents of Vue 1.0 发布',
  },
} as const

export default menuLocales

type DeepStringLeaves<T>
  = T extends string ? string
    : T extends Record<PropertyKey, any>
      ? { [K in keyof T]: DeepStringLeaves<T[K]> }
      : never

export type Menu = DeepStringLeaves<typeof menuLocales>
