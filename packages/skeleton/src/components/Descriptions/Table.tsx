import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { SkeletonTitleProps } from 'antdv-next/dist/skeleton/Title'
import type { CSSProperties } from 'vue'
import { Card, Skeleton, SkeletonButton } from 'antdv-next'
import { defineComponent } from 'vue'
import TableItemSkeleton from './TableItem'

export interface TableSkeletonProps {
  active: boolean
  size?: number
}

const TableSkeleton = defineComponent<TableSkeletonProps, {}, string, CustomSlotsType<{
  default?: () => VueNode[]
}>>((props, { expose }) => {
  expose({})
  return () => {
    const { active, size = 4 } = props
    return (
      <Card variant="borderless">
        <SkeletonButton
          active={active}
          size="small"
          style={{ width: '100px', marginBlockEnd: '16px' }}
        />
        <TableItemSkeleton header active={active} />
        {Array.from({ length: size }).fill(null).map((_, index) => (
          <TableItemSkeleton key={index} active={active} />
        ))}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            paddingBlockStart: '16px',
          }}
        >
          <Skeleton
            active={active}
            paragraph={false}
            title={{
              style: {
                margin: 0,
                height: '32px',
                float: 'right',
                maxWidth: '630px',
              },
            } as SkeletonTitleProps & { style: CSSProperties }}
          />
        </div>
      </Card>
    )
  }
}, {
  name: 'TableSkeleton',
  inheritAttrs: false,
})

export default TableSkeleton
