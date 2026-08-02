export default {
  themeBtn: {
    system: 'Follow System',
    light: 'Light Theme',
    dark: 'Dark Theme',
    compact: 'Compact Theme',
    happy: 'Happy Work Effect',
  },

  codeDemo: {
    type: {
      typescript: 'TypeScript',
      javascript: 'JavaScript',
    },
    action: {
      externalLink: 'Open in new window',
      openPlayground: 'Open in Playground',
      expandCode: 'Expand Code',
      expandedCode: 'Collapse Code',
      stackblitz: 'Open in StackBlitz',
      copied: 'Copied Success',
      copy: 'Copy Code',
    },
  },

  iconSearch: {
    themes: {
      outlined: 'Outlined',
      filled: 'Filled',
      twoTone: 'TwoTone',
    },

    categories: {
      direction: 'Directional Icons',
      suggestion: 'Suggested Icons',
      editor: 'Editor Icons',
      data: 'Data Icons',
      logo: 'Brand and Logos',
      other: 'Application Icons',
    },

    searchPlaceholder: 'Search icons',
    copiedMessage: 'copied 🎉',
  },

  docSearch: {
    placeholder: 'Type keywords...',
    emptyText: 'No results found',
    loadingText: 'Loading search index...',
    sections: {
      components: 'Components',
      docs: 'Docs',
      changelog: 'Changelog',
      playground: 'Playground',
    },
  },
} as const
