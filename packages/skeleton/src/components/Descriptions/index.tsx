import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { FunctionalComponent } from 'vue'
import { Card, SkeletonButton } from 'antdv-next'
import { defineComponent } from 'vue'
import { Line, PageHeaderSkeleton } from '../List'
import DescriptionsItemSkeleton from './DescriptionsItem'
import DescriptionsLargeItemSkeleton from './DescriptionsLargeItem'
import TableSkeleton from './Table'

export interface DescriptionsPageSkeletonProps {
  active?: boolean
  pageHeader?: false
  list?: false | number
}

export const DescriptionsSkeleton: FunctionalComponent<{
  active: boolean
}> = ({ active }) => {
  return (
    <Card
      variant="borderless"
      style={{
        borderStartEndRadius: 0,
        borderTopLeftRadius: 0,
      }}
    >
      <SkeletonButton
        active={active}
        size="small"
        style={{ width: '100px', marginBlockEnd: '16px' }}
      />
      <DescriptionsItemSkeleton active={active} />
      <DescriptionsLargeItemSkeleton active={active} />
    </Card>
  )
}

const DescriptionsPageSkeleton = defineComponent<DescriptionsPageSkeletonProps, {}, string, CustomSlotsType<{
  default?: () => VueNode[]
}>>((props, { expose }) => {
  expose({})
  return () => {
    const {
      active = true,
      pageHeader,
      list,
    } = props
    return (
      <div style={{
        width: '100%',
      }}
      >
        {pageHeader !== false && <PageHeaderSkeleton active={active} />}
        <DescriptionsSkeleton active={active} />
        {list !== false && <Line />}
        {list !== false && <TableSkeleton active={active} size={list} />}
      </div>
    )
  }
}, {
  name: 'DescriptionsPageSkeleton',
  inheritAttrs: false,
})

export default DescriptionsPageSkeleton
