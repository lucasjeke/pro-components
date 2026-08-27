import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import { Card, SkeletonAvatar, SkeletonButton, Space } from 'antdv-next'
import { defineComponent } from 'vue'
import { PageHeaderSkeleton } from '../List'

export interface ResultPageSkeletonProps {
  active?: boolean
  pageHeader?: false
}

const ResultPageSkeleton = defineComponent<ResultPageSkeletonProps, {}, string, CustomSlotsType<{
  default?: () => VueNode[]
}>>((props, { expose }) => {
  expose({})
  return () => {
    const {
      active = true,
      pageHeader,
    } = props
    return (
      <div
        style={{
          width: '100%',
        }}
      >
        {pageHeader !== false && <PageHeaderSkeleton active={active} />}
        <Card>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              padding: '128px',
            }}
          >
            <SkeletonAvatar
              size={64}
              style={{
                marginBlockEnd: '32px',
              }}
            />
            <SkeletonButton
              active={active}
              style={{ width: '214px', marginBlockEnd: '8px' }}
            />
            <SkeletonButton active={active} style={{ width: '328px' }} size="small" />
            <Space
              style={{
                marginBlockStart: '24px',
              }}
            >
              <SkeletonButton active={active} style={{ width: '116px' }} />
              <SkeletonButton active={active} style={{ width: '116px' }} />
            </Space>
          </div>
        </Card>
      </div>
    )
  }
}, {
  name: 'ResultPageSkeleton',
  inheritAttrs: false,
})
export default ResultPageSkeleton
