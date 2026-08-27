import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { SkeletonTitleProps } from 'antdv-next/dist/skeleton/Title'
import type { CSSProperties } from 'vue'
import { Skeleton, SkeletonButton } from 'antdv-next'
import { defineComponent } from 'vue'

export interface DescriptionsLargeItemProps {
  active?: boolean
}
const DescriptionsLargeItemSkeleton = defineComponent<DescriptionsLargeItemProps, {}, string, CustomSlotsType<{
  default?: () => VueNode[]
}>>((props, { expose }) => {
  expose({})
  return () => {
    const { active } = props
    return (
      <div style={{
        marginBlockStart: '32px',
      }}
      >
        <SkeletonButton
          active={active}
          size="small"
          style={{ width: '100px', marginBlockEnd: '16px' }}
        />
        <div
          style={{
            width: '100%',
            justifyContent: 'space-between',
            display: 'flex',
          }}
        >
          <div
            style={{
              flex: 1,
              marginInlineEnd: '24px',
              maxWidth: '300px',
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
          <div
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                maxWidth: '300px',
                margin: 'auto',
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
            </div>
          </div>
        </div>
      </div>
    )
  }
}, {
  name: 'DescriptionsLargeItemSkeleton',
  inheritAttrs: false,
})

export default DescriptionsLargeItemSkeleton
