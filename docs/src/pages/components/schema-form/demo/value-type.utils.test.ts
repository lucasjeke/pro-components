import { AggregationColor } from 'antdv-next/dist/color-picker/color'
import { describe, expect, it } from 'vitest'
import { cloneValueTypeInitialValue } from './value-type.utils'

describe('cloneValueTypeInitialValue', () => {
  it('recursively clones arrays and plain objects', () => {
    const source = {
      nested: { value: 1 },
      list: [{ value: 2 }],
    }

    const cloned = cloneValueTypeInitialValue(source)

    expect(cloned).not.toBe(source)
    expect(cloned.nested).not.toBe(source.nested)
    expect(cloned.list).not.toBe(source.list)
    expect(cloned.list[0]).not.toBe(source.list[0])
    expect(cloned).toEqual(source)
  })

  it('preserves AggregationColor instances and their prototype methods', () => {
    const color = new AggregationColor('#1890ff')

    const cloned = cloneValueTypeInitialValue(color)

    expect(cloned).toBe(color)
    expect(cloned.toHexString()).toBe('#1890ff')
  })
})
