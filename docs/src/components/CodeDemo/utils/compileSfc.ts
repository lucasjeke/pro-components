import * as Vue from 'vue'

let compilerSfc: typeof import('@vue/compiler-sfc') | null = null
let sucraseModule: typeof import('sucrase') | null = null

const modulesMap: Record<string, any> = {
  vue: Vue,
}

const moduleLoaders: Record<string, () => Promise<any>> = {
  '@antdv-next/icons': () => import('@antdv-next/icons'),
  'antdv-next': () => import('antdv-next'),
  '@v-c/resize-observer': () => import('@v-c/resize-observer'),
  '@antdv-next1/pro-card': () => import('@antdv-next1/pro-card'),
  '@antdv-next1/pro-field': () => import('@antdv-next1/pro-field'),
  '@antdv-next1/pro-form': () => import('@antdv-next1/pro-form'),
  '@antdv-next1/pro-layout': () => import('@antdv-next1/pro-layout'),
  '@antdv-next1/pro-listy': () => import('@antdv-next1/pro-listy'),
  '@antdv-next1/pro-provider': () => import('@antdv-next1/pro-provider'),
  '@antdv-next1/pro-table': () => import('@antdv-next1/pro-table'),
  '@antdv-next1/pro-utils': () => import('@antdv-next1/pro-utils'),
  '@antdv-next1/route-utils': () => import('@antdv-next1/route-utils'),
  '@antdv-next1/pro-skeleton': () => import('@antdv-next1/pro-skeleton'),
  '@antdv-next1/pro-descriptions': () => import('@antdv-next1/pro-descriptions'),
  '@antdv-next1/pro-components': () => import('@antdv-next1/pro-components'),
  dayjs: () => import('dayjs').then(module => module.default || module),
}

function findImportSpecifiers(source: string) {
  const specifiers = new Set<string>()
  const importRe = /import(?:\s+type)?[\s\S]*?\sfrom\s*['"]([^'"]+)['"]|import\s*['"]([^'"]+)['"]/g
  let match: RegExpExecArray | null

  while ((match = importRe.exec(source))) {
    const specifier = match[1] || match[2]
    if (specifier)
      specifiers.add(specifier)
  }

  return specifiers
}

async function ensureDependencies(source: string) {
  if (!compilerSfc)
    compilerSfc = await import('@vue/compiler-sfc')

  if (!sucraseModule)
    sucraseModule = await import('sucrase')

  await Promise.all(Array.from(findImportSpecifiers(source)).map(async (specifier) => {
    if (modulesMap[specifier])
      return

    const loader = moduleLoaders[specifier]
    if (loader)
      modulesMap[specifier] = await loader()
  }))
}

function transformCode(code: string): string {
  let result = code
  const exportedNames: string[] = []

  result = result.replace(
    /import\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"]\s*;?/g,
    (_, names, source) => {
      const transformedNames = names.replace(/\bas\b/g, ':')
      return `const {${transformedNames}} = (__modules__["${source}"] || {});`
    },
  )

  result = result.replace(
    /import\s+(\w+)\s+from\s*['"]([^'"]+)['"]\s*;?/g,
    (_, name, source) => `const ${name} = (__modules__["${source}"] || {}).default || (__modules__["${source}"] || {});`,
  )

  result = result.replace(
    /import\s*\*\s*as\s+(\w+)\s+from\s*['"]([^'"]+)['"]\s*;?/g,
    (_, name, source) => `const ${name} = (__modules__["${source}"] || {});`,
  )

  result = result.replace(
    /^\s*import\s*['"][^'"]+['"]\s*(?:;\s*)?$/gm,
    '',
  )

  result = result.replace(/export\s+default\s+/g, '__exports__.default = ')

  result = result.replace(/export\s+function\s+(\w+)/g, (_, name) => {
    exportedNames.push(name)
    return `function ${name}`
  })

  result = result.replace(/export\s+(const|let|var)\s+(\w+)/g, (_, keyword, name) => {
    exportedNames.push(name)
    return `${keyword} ${name}`
  })

  for (const name of exportedNames)
    result += `\n__exports__["${name}"] = ${name};`

  return result
}

function normalizeCompileErrors(errors: Array<string | Error>) {
  return errors
    .map(error => typeof error === 'string' ? error : error.message)
    .join('\n')
}

export async function compileSfcSource(source: string): Promise<{ component: any, error: string | null }> {
  await ensureDependencies(source)

  try {
    const { compileScript, compileTemplate, parse } = compilerSfc!
    const { transform } = sucraseModule!
    const id = `inline-demo-${Math.random().toString(36).slice(2, 8)}`
    const { descriptor, errors } = parse(source, { filename: 'InlineDemo.vue' })

    if (errors.length)
      return { component: null, error: normalizeCompileErrors(errors) }

    let jsCode = ''
    const script = descriptor.scriptSetup || descriptor.script

    if (descriptor.scriptSetup) {
      jsCode = compileScript(descriptor, {
        id,
        inlineTemplate: Boolean(descriptor.template),
      }).content
    }
    else if (descriptor.script) {
      const compiled = compileScript(descriptor, { id })
      jsCode = compiled.content

      if (descriptor.template) {
        const templateResult = compileTemplate({
          source: descriptor.template.content,
          filename: 'InlineDemo.vue',
          id,
          compilerOptions: {
            bindingMetadata: compiled.bindings,
          },
        })

        if (templateResult.errors.length)
          return { component: null, error: normalizeCompileErrors(templateResult.errors) }

        jsCode += `\n${templateResult.code}`
      }
    }
    else if (descriptor.template) {
      const templateResult = compileTemplate({
        source: descriptor.template.content,
        filename: 'InlineDemo.vue',
        id,
      })

      if (templateResult.errors.length)
        return { component: null, error: normalizeCompileErrors(templateResult.errors) }

      jsCode = templateResult.code
    }

    if (!script && !descriptor.template)
      return { component: null, error: 'No template or script found' }

    jsCode = transform(jsCode, {
      transforms: ['typescript'],
      disableESTransforms: true,
    }).code

    jsCode = transformCode(jsCode)

    const __exports__: Record<string, any> = {}
    // eslint-disable-next-line no-new-func
    const fn = new Function('__modules__', '__exports__', jsCode)
    fn(modulesMap, __exports__)

    if (!descriptor.scriptSetup && descriptor.script && descriptor.template) {
      const component = __exports__.default || {}
      if (__exports__.render)
        component.render = __exports__.render
      return { component, error: null }
    }

    if (!descriptor.scriptSetup && !descriptor.script && descriptor.template)
      return { component: { render: __exports__.render }, error: null }

    return { component: __exports__.default, error: null }
  }
  catch (error: any) {
    return { component: null, error: error?.message || String(error) }
  }
}
