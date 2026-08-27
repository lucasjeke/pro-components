import type { CustomSlotsType, VueNode } from '@v-c/util/dist/type'
import type { SkeletonParagraphProps } from 'antdv-next/dist/skeleton/Paragraph'
import type { SkeletonTitleProps } from 'antdv-next/dist/skeleton/Title'
import type { CSSProperties, FunctionalComponent } from 'vue'
import { unit } from '@antdv-next/cssinjs'
import { Card, Divider, Skeleton, SkeletonButton, Space } from 'antdv-next'
import { defineComponent } from 'vue'
import StatisticSkeleton from './Statistic'

export interface ListPageSkeletonProps {
  active?: boolean
  pageHeader?: false
  statistic?: number | false
  actionButton?: false
  toolbar?: false
  list?: number | false
}

/** 一条分割线 */
export const Line: FunctionalComponent<{
  padding?: string | number
}> = ({ padding }) => {
  return (
    <div
      style={{
        padding: unit(padding || '') || '0 24px',
      }}
    >
      <Divider style={{ margin: 0 }} />
    </div>
  )
}

/** 列表子项目骨架屏 */
export const ListSkeletonItem: FunctionalComponent<{ active: boolean }> = ({ active }) => (
  <>
    <Card
      variant="borderless"
      styles={{
        root: {
          borderRadius: 0,
        },
        body: {
          padding: '24px',
        },
      }}
    >
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            maxWidth: '100%',
            flex: 1,
          }}
        >
          <Skeleton
            active={active}
            title={{
              width: '100px',
              style: {
                marginBlockStart: 0,
              },
            } as SkeletonTitleProps & { style: CSSProperties }}
            paragraph={{
              rows: 1,
              style: {
                margin: 0,
              },
            } as SkeletonParagraphProps & { style: CSSProperties }}
          />
        </div>
        <Skeleton.Button
          active={active}
          size="small"
          style={{ width: '165px', marginBlockStart: '12px' }}
        />
      </div>
    </Card>
    <Line />
  </>
)

/** 列表骨架屏 */
export const ListSkeleton: FunctionalComponent<{
  size: number
  active?: boolean
  actionButton?: boolean
}> = ({ size, active = true, actionButton }) => (
  <Card
    variant="borderless"
    styles={{
      body: {
        padding: 0,
      },
    }}
  >
    {Array.from({ length: size }).fill(null).map((_, index) => (
      <ListSkeletonItem key={index} active={!!active} />
    ))}

    {actionButton !== false && (
      <Card
        variant="borderless"
        styles={{
          root: {
            borderStartEndRadius: 0,
            borderTopLeftRadius: 0,
          },
          body: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
        }}
      >
        <SkeletonButton
          style={{
            width: '102px',
          }}
          active={active}
          size="small"
        />
      </Card>
    )}
  </Card>
)

/**
 * 面包屑的 骨架屏
 *
 */
export const PageHeaderSkeleton: FunctionalComponent<{
  active: boolean
}> = ({ active }) => {
  return (
    <div
      style={{
        marginBlockEnd: '16px',
      }}
    >
      <Skeleton
        paragraph={false}
        title={{
          width: '185px',
        }}
      />
      <SkeletonButton active={active} size="small" />
    </div>
  )
}

/**
 * 列表操作栏的骨架屏
 *
 */
export const ListToolbarSkeleton: FunctionalComponent<{
  active: boolean
}> = ({ active }) => (
  <Card
    variant="borderless"
    styles={{
      root: {
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0,
      },
      body: {
        paddingBlockEnd: '8px',
      },
    }}
  >
    <Space
      style={{
        width: '100%',
        justifyContent: 'space-between',
      }}
    >
      <SkeletonButton active={active} style={{ width: '200px' }} size="small" />
      <Space>
        <SkeletonButton active={active} size="small" style={{ width: '120px' }} />
        <SkeletonButton active={active} size="small" style={{ width: '80px' }} />
      </Space>
    </Space>
  </Card>
)

const ListPageSkeleton = defineComponent<ListPageSkeletonProps, {}, string, CustomSlotsType<{
  default?: () => VueNode[]
}>>((props, { expose }) => {
  expose({})
  return () => {
    const { active = true, statistic, actionButton, toolbar, pageHeader, list = 5 } = props
    return (
      <div
        style={{
          width: '100%',
        }}
      >
        {pageHeader !== false && <PageHeaderSkeleton active={active} />}
        {statistic !== false && (
          <StatisticSkeleton size={statistic as number} active={active} />
        )}
        {(toolbar !== false || list !== false) && (
          <Card
            variant="borderless"
            styles={{
              body: {
                padding: 0,
              },
            }}
          >
            {toolbar !== false && <ListToolbarSkeleton active={active} />}
            {list !== false && (
              <ListSkeleton
                size={list as number}
                active={active}
                actionButton={actionButton}
              />
            )}
          </Card>
        )}
      </div>
    )
  }
}, {
  name: 'ListPageSkeleton',
  inheritAttrs: false,
})

export default ListPageSkeleton
