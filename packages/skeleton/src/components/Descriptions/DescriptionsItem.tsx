import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { SkeletonTitleProps } from 'antdv-next/dist/skeleton/Title'
import type { CSSProperties } from 'vue'
import { Skeleton, useBreakpoint } from 'antdv-next'
import { computed, defineComponent } from 'vue'

export interface DescriptionsItemSkeletonProps {
  size?: number
  active?: boolean
}

const MediaQueryKeyEnum = {
  xs: 1,
  sm: 2,
  md: 3,
  lg: 3,
  xl: 3,
  xxl: 4,
}

const DescriptionsItemSkeleton = defineComponent<DescriptionsItemSkeletonProps, {}, string, CustomSlotsType<{
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
    const { size, active } = props
    const col = breakpoint || defaultCol
    const colSize
      = Object.keys(col.value || {}).filter(key => col.value?.[key as 'lg'] === true)[0] || 'md'

    const arraySize
      = size === undefined ? MediaQueryKeyEnum[colSize as 'md'] || 3 : size
    return (
      <div style={{
        width: '100%',
        justifyContent: 'space-between',
        display: 'flex',
      }}
      >
        {Array.from({ length: arraySize }).fill(null).map((_, index) => (
          <div
            key={index}
            style={{
              flex: 1,
              paddingInlineStart: index === 0 ? 0 : '24px',
              paddingInlineEnd: index === arraySize - 1 ? 0 : '24px',
            }}
          >
            <Skeleton
              active={active}
              paragraph={false}
              title={{
                style: { marginBlockStart: 0 },
              } as SkeletonTitleProps & { style: CSSProperties }}
            />
            <Skeleton
              active={active}
              paragraph={false}
              title={{
                style: { marginBlockStart: '8px' },
              } as SkeletonTitleProps & { style: CSSProperties }}
            />
            <Skeleton
              active={active}
              paragraph={false}
              title={{
                style: { marginBlockStart: '8px' },
              } as SkeletonTitleProps & { style: CSSProperties }}
            />
          </div>
        ))}
      </div>
    )
  }
}, {
  name: 'DescriptionsItemSkeleton',
  inheritAttrs: false,
})

export default DescriptionsItemSkeleton
