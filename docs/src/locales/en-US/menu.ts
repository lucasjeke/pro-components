const menuLocales = {
  header: {
    docs: {
      vue: 'Development',
    },
    components: 'Components',
    blog: 'Blog',
    resources: 'Resources',
    playground: 'Playground',
  },

  docs: {
    vue: {
      introduce: 'Ant Design of Vue',
      use: 'How to Use',
      gettingStarted: 'Getting Started',
      ai: 'AI',
      llms: 'LLMs.txt',
      skills: 'Skills',
      nuxt: 'Nuxt',
      advancedUse: 'Advanced Usage',
      secondaryDevelopment: 'Secondary Development',
      unocss: 'UnoCSS',
      tailwindcss: 'Tailwind CSS',
      customizeTheme: 'Customize Theme',
      compatibleStyle: 'Compatible Style',
      i18n: 'I18n',
      commonProps: 'Common Props',
      other: 'Others',
      awesome: 'Awesome',
      contributing: 'Contributing',
      releaseProcess: 'Commit and Release',
      faq: 'FAQ',
    },
  },

  blog: {
    proComponentsRelease: 'ProComponents of Vue 1.0 Released',
  },
} as const

export default menuLocales

type DeepStringLeaves<T>
  = T extends string ? string
    : T extends Record<PropertyKey, any>
      ? { [K in keyof T]: DeepStringLeaves<T[K]> }
      : never

export type Menu = DeepStringLeaves<typeof menuLocales>
