export const baseConfig = {
  'App.vue': '',
  'antdv-next.js': 'import Antd from \'antdv-next\'\nimport { getCurrentInstance } from \'vue\'\n\nlet installed = false\nawait loadStyle()\n\nexport function setupAntdvNext() {\n  if (installed) return\n  const instance = getCurrentInstance()\n  instance.appContext.app.use(Antd)\n  installed = true\n}\n\nexport function loadStyle() {\n  const styles = [\'https://cdn.jsdelivr.net/npm/antdv-next@latest/dist/reset.css\', \'https://cdn.jsdelivr.net/npm/antdv-next@latest/dist/antd.css\'].map((style) => {\n    return new Promise((resolve, reject) => {\n      const link = document.createElement(\'link\')\n      link.rel = \'stylesheet\'\n      link.href = style\n      link.addEventListener(\'load\', resolve)\n      link.addEventListener(\'error\', reject)\n      document.body.append(link)\n    })\n  })\n  return Promise.allSettled(styles)\n}\n',
  'tsconfig.json': '{\n  "compilerOptions": {\n    "target": "ESNext",\n    "jsx": "preserve",\n    "module": "ESNext",\n    "moduleResolution": "Bundler",\n    "types": ["antdv-next/global.d.ts"],\n    "allowImportingTsExtensions": true,\n    "allowJs": true,\n    "checkJs": true\n  },\n  "vueCompilerOptions": {\n    "target": 3.3\n  }\n}\n',
  'PlaygroundMain.vue': '<script setup>\nimport { theme } from \'antdv-next\'\nimport { computed, onMounted, onUnmounted, ref } from \'vue\'\nimport { setupAntdvNext } from \'./antdv-next.js\'\nimport App from \'./App.vue\'\nsetupAntdvNext()\n\nconst { darkAlgorithm, defaultAlgorithm } = theme\nconst isDark = ref(document.documentElement.classList.contains(\'dark\'))\n\nconst themeConfig = computed(() => ({\n  algorithm: isDark.value ? darkAlgorithm : defaultAlgorithm,\n}))\n\nlet observer\nonMounted(() => {\n  observer = new MutationObserver(() => {\n    isDark.value = document.documentElement.classList.contains(\'dark\')\n  })\n  observer.observe(document.documentElement, {\n    attributes: true,\n    attributeFilter: [\'class\'],\n  })\n})\nonUnmounted(() => observer?.disconnect())\n</script>\n\n<template>\n  <a-config-provider :theme="themeConfig">\n    <App />\n  </a-config-provider>\n</template>\n',
  'import-map.json': '{\n  "imports": {\n    "vue": "https://cdn.jsdelivr.net/npm/@vue/runtime-dom@latest/dist/runtime-dom.esm-browser.js",\n    "@vue/shared": "https://cdn.jsdelivr.net/npm/@vue/shared@latest/dist/shared.esm-bundler.js",\n    "antdv-next": "https://cdn.jsdelivr.net/npm/antdv-next@latest/dist/antd.esm.js",\n    "antdv-next/": "https://cdn.jsdelivr.net/npm/antdv-next/@latest/",\n    "@antdv-next/icons": "https://cdn.jsdelivr.net/npm/@antdv-next/icons@latest/dist/antd-icons.esm.js",\n    "@antdv-next1/pro-components": "https://cdn.jsdelivr.net/npm/@antdv-next1/pro-components@latest/dist/index.js"\n  },\n  "scopes": {}\n}',
  '_o': {},
}

function toBase64(str: string) {
  const bytes = new TextEncoder().encode(str)
  let binary = ''
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })
  return btoa(binary)
}

export function loadPlaygroundUrl(code: string) {
  baseConfig['App.vue'] = code
  return `http://localhost:3050/#${toBase64(JSON.stringify(baseConfig))}`
}
