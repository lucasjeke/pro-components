import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const currentDir = dirname(fileURLToPath(import.meta.url))
const packageDir = resolve(currentDir, '..')
const packagesDir = resolve(packageDir, '..')

const packageNames = [
  '@antdv-next1/pro-card',
  '@antdv-next1/pro-components',
  '@antdv-next1/pro-field',
  '@antdv-next1/pro-form',
  '@antdv-next1/pro-layout',
  '@antdv-next1/pro-listy',
  '@antdv-next1/pro-provider',
  '@antdv-next1/pro-table',
  '@antdv-next1/pro-utils',
] as const

const packageDirMap: Record<(typeof packageNames)[number], string> = {
  '@antdv-next1/pro-card': 'card',
  '@antdv-next1/pro-components': 'components',
  '@antdv-next1/pro-field': 'field',
  '@antdv-next1/pro-form': 'form',
  '@antdv-next1/pro-layout': 'layout',
  '@antdv-next1/pro-listy': 'listy',
  '@antdv-next1/pro-provider': 'provider',
  '@antdv-next1/pro-table': 'table',
  '@antdv-next1/pro-utils': 'utils',
}

function readPackageVersion(packageName: (typeof packageNames)[number]) {
  const packageJsonPath = resolve(packagesDir, packageDirMap[packageName], 'package.json')
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {
    version?: string
  }

  if (!packageJson.version)
    throw new Error(`${packageJsonPath} missing version`)

  return packageJson.version
}

const content = `export const version = {
${packageNames.map(packageName => `  '${packageName}': '${readPackageVersion(packageName)}',`).join('\n')}
}
`

writeFileSync(resolve(packageDir, 'src/version.ts'), content)
