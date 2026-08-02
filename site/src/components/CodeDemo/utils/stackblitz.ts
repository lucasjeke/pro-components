import sdk from '@stackblitz/sdk'

function genFilesMap(title: string, code: string) {
  return {
    'package.json': JSON.stringify({
      name: 'pro-components-vue-inline-demo',
      version: '1.0.0',
      private: true,
      dependencies: {
        '@antdv-next/icons': 'latest',
        '@antdv-next1/pro-components': 'latest',
        'antdv-next': 'latest',
        'vue': 'latest',
      },
      devDependencies: {
        '@vitejs/plugin-vue': 'latest',
        'typescript': 'latest',
        'vite': 'latest',
        'vue-tsc': 'latest',
      },
      scripts: {
        dev: 'vite',
        build: 'vue-tsc && vite build',
        preview: 'vite preview',
      },
    }, null, 2),
    'index.html': `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>`,
    'vite.config.ts': `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
})`,
    'src/main.ts': `import { createApp } from 'vue'
import Antd from 'antdv-next'
import App from './App.vue'
import 'antdv-next/dist/reset.css'

createApp(App).use(Antd).mount('#app')`,
    'src/App.vue': code,
    'src/vite-env.d.ts': '/// <reference types="vite/client" />',
  }
}

export function openStackBlitz(title: string, code: string) {
  sdk.openProject({
    title,
    description: 'Pro Components Vue Inline Demo',
    template: 'node',
    files: genFilesMap(title, code),
  }, {
    openFile: 'src/App.vue',
  })
}
