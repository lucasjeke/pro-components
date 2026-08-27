import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { SkeletonTitleProps } from 'antdv-next/dist/skeleton/Title'
import type { CSSProperties } from 'vue'
import { Skeleton, useBreakpoint } from 'antdv-next'
import { computed, defineComponent } from 'vue'
import { Line } from '../List'

export interface TableItemSkeletonProps {
  active: boolean
  header?: boolean
}
const MediaQueryKeyEnum = {
  xs: 1,
  sm: 2,
  md: 3,
  lg: 3,
  xl: 3,
  xxl: 4,
}

const TableItemSkeleton = defineComponent<TableItemSkeletonProps, {}, string, CustomSlotsType<{
  default?: () => VueNode[]
}>>((props, { expose }) => {
  const defaultCol = computed(
    () => ({
      lg: true,
      md: true,
      sm: false,
      xl: false,
      xs: false,
      xxl: false,
    }),
  )
  const breakpoint = useBreakpoint()
  expose({})
  return () => {
    const { active, header = false } = props
    const col = breakpoint || defaultCol
    const colSize
      = Object.keys(col.value || {}).filter(key => col.value?.[key as 'md'] === true)[0] || 'md'
    const arraySize = MediaQueryKeyEnum[colSize as 'md'] || 3
    return (
      <>
        <div style={{
          display: 'flex',
          background: header ? 'rgba(0,0,0,0.02)' : 'none',
          padding: '24px 8px',
        }}
        >
          {Array.from({ length: arraySize }).fill(null).map((_, index) => (
            <div
              key={index}
              style={{
                flex: 1,
                paddingInlineStart: header && index === 0 ? 0 : '20px',
                paddingInlineEnd: '32px',
              }}
            >
              <Skeleton
                active={active}
                paragraph={false}
                title={{
                  style: {
                    margin: 0,
                    height: '24px',
                    width: header ? '75px' : '100%',
                  },
                } as SkeletonTitleProps & { style: CSSProperties }}
              />
            </div>
          ))}
          <div
            style={{
              flex: 3,
              paddingInlineStart: '32px',
            }}
          >
            <Skeleton
              active={active}
              paragraph={false}
              title={{
                style: { margin: 0, height: '24px', width: header ? '75px' : '100%' },
              } as SkeletonTitleProps & { style: CSSProperties }}
            />
          </div>
        </div>
        <Line padding="0px 0px" />
      </>
    )
  }
}, {
  name: 'TableItemSkeleton',
  inheritAttrs: false,
})

export default TableItemSkeleton
