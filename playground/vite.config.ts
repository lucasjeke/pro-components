import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import replPkg from '@vue/repl/package.json'
import Unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import Mkcert from 'vite-plugin-mkcert'
import { tsxResolveTypes } from 'vite-plugin-tsx-resolve-types'
import pkg from './package.json'

const baseUrl = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig(() => {
  return {
    server: {
      port: 3050,
    },
    define: {
      'import.meta.env.APP_VERSION': JSON.stringify(pkg.version),
      'import.meta.env.REPL_VERSION': JSON.stringify(replPkg.version),
    },
    resolve: {
      alias: [
        {
          find: '@',
          replacement: '/src',
        },
      ],
    },
    build: {
      rollupOptions: {
        external: ['typescript'],
      },
    },
    plugins: [
      {
        name: 'vue.worker',
        transform(code, id) {
          if (id.includes('vue.worker')) {
            return {
              code: patchVueWorker(code),
              map: null,
            }
          }
        },
        generateBundle(_, bundle) {
          for (const [fileName, file] of Object.entries(bundle)) {
            if (fileName.includes('vue.worker')) {
              if ('source' in file) {
                console.info(file, 'file')
                file.source = patchVueWorker(file.source.toString())
              }
              break
            }
          }
        },
      },
      tsxResolveTypes({
        defaultPropsToUndefined: ['Boolean'],
      }),
      vueJsx(),
      vue({
        script: {
          defineModel: true,
          propsDestructure: true,
          fs: {
            fileExists: fs.existsSync,
            readFile: file => fs.readFileSync(file, 'utf8'),
          },
        },
      }),
      AutoImport({
        dirs: [path.resolve(baseUrl, 'composables')],
        imports: ['vue', '@vueuse/core'],
        dts: path.resolve(baseUrl, 'auto-imports.d.ts'),
      }),
      Components({
        dirs: [path.resolve(baseUrl, 'components')],
        dts: path.resolve(baseUrl, 'components.d.ts'),
      }),
      Unocss(),
      Mkcert(),
      Inspect(),
    ],
    optimizeDeps: {
      exclude: ['@vue/repl'],
    },
  }
})

function patchVueWorker(code: string) {
  return String.raw`${code}
    ;(function() {
      var _bc = new BroadcastChannel('vue-repl-dts')
      var _fetch = self.fetch
      var _pending = 0
      var pr = new URL(location.href).searchParams.get('pr')

      self.fetch = function() {
        var args = [].slice.call(arguments)
        var url = typeof args[0] === 'string' ? args[0] : ''

        if (pr && /https:\/\/cdn\.jsdelivr\.net\/npm\/@antdv-next1\/pro-components(@[^/]+)?\//.test(url)) {
          args[0] = url.replace(/https:\/\/cdn\.jsdelivr\.net\/npm\/@antdv-next1\/pro-components(@[^/]+)?/, 'https://raw.esm.sh/pr/@antdv-next1/pro-components@' + pr)
        }

        if (url.endsWith('.d.ts') || url.includes('data.jsdelivr.com')) {
          _pending++
          _bc.postMessage({ pending: _pending })
          return _fetch.apply(self, args).finally(function() {
            _pending--
            _bc.postMessage({ pending: _pending })
          })
        }
        return _fetch.apply(self, args)
      }
    })()`
}
