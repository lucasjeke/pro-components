import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { SkeletonTitleProps } from 'antdv-next/dist/skeleton/Title'
import type { CSSProperties } from 'vue'
import { Card, Skeleton, SkeletonButton, useBreakpoint } from 'antdv-next'
import { computed, defineComponent } from 'vue'

export interface StatisticSkeletonProps {
  size?: number
  active?: boolean
}
export const MediaQueryKeyEnum = {
  xs: 2,
  sm: 2,
  md: 4,
  lg: 4,
  xl: 6,
  xxl: 6,
}
const StatisticSkeleton = defineComponent<StatisticSkeletonProps, {}, string, CustomSlotsType<{
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

  const col = computed(() => {
    return breakpoint.value || defaultCol.value
  })
  const colSize
    = computed(() => Object.keys(col.value).filter(key => col.value?.[key as 'md'] === true)[0] || 'md')

  const arraySize
    = computed(() => props.size === undefined ? MediaQueryKeyEnum[colSize.value as 'md'] || 6 : props.size)
  const firstWidth = (index: number) => {
    if (index === 0) {
      return 0
    }
    if (arraySize.value > 2) {
      return 42
    }
    return 16
  }
  expose({})
  return () => {
    const { active } = props

    return (
      <Card
        variant="borderless"
        styles={{
          root: {
            marginBlockEnd: '16px',
          },
        }}
      >
        <div
          style={{
            width: '100%',
            justifyContent: 'space-between',
            display: 'flex',
          }}
        >
          {Array.from({ length: arraySize.value }).fill(null).map((_, index) => (
            <div
              key={index}
              style={{
                borderInlineStart:
                arraySize.value > 2 && index === 1
                  ? '1px solid rgba(0,0,0,0.06)'
                  : undefined,
                paddingInlineStart: firstWidth(index),
                flex: 1,
                marginInlineEnd: index === 0 ? '16px' : 0,
              }}
            >
              <Skeleton
                active={active}
                paragraph={false}
                title={{
                  width: '100px',
                  style: { marginBlockStart: 0 },
                } as SkeletonTitleProps & { style: CSSProperties }}
              />
              <SkeletonButton
                active={active}
                style={{
                  height: '48px',
                }}
              />
            </div>
          ))}
        </div>
      </Card>
    )
  }
}, {
  name: 'StatisticSkeleton',
  inheritAttrs: false,
})
export default StatisticSkeleton
