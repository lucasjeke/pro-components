import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = resolve(import.meta.dirname, '..')

describe('StatisticCard exports', () => {
  it('exposes semantic group and divider components from package entry', () => {
    const entry = readFileSync(resolve(root, 'src/index.ts'), 'utf8')

    expect(entry).toContain('ProStatisticCardGroup')
    expect(entry).toContain('ProStatisticCardDivider')
  })

  it('attaches semantic group and divider components to StatisticCard', () => {
    const source = readFileSync(resolve(root, 'src/components/StatisticCard/index.tsx'), 'utf8')

    expect(source).toContain('ProStatisticCard.Group')
    expect(source).toContain('ProStatisticCard.Divider')
  })

  it('marks StatisticCardGroup as a ProCard child for nested colSpan layout', () => {
    const source = readFileSync(resolve(root, 'src/components/StatisticCard/index.tsx'), 'utf8')

    expect(source).toContain('ProStatisticCardGroup.isProCard = true')
  })
})
