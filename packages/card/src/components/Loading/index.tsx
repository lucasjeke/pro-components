import type { CustomSlotsType } from '@v-c/util/dist/type'
import { Col, Row, Skeleton } from 'antdv-next'
import { defineComponent } from 'vue'

export interface CardLoadingProps {
  prefixCls: string
}

const skeletonRows = [
  [22],
  [8, 15],
  [6, 18],
  [13, 9],
  [4, 3, 16],
]

const CardLoading = defineComponent<CardLoadingProps, {}, string, CustomSlotsType<{}>>(
  props => () => (
    <div class={`${props.prefixCls}-loading-content`}>
      {skeletonRows.map((columns, rowIndex) => (
        <Row key={rowIndex} gutter={8}>
          {columns.map((span, columnIndex) => (
            <Col key={columnIndex} span={span}>
              <Skeleton
                active
                round
                title={{ width: '100%' }}
                paragraph={false}
              />
            </Col>
          ))}
        </Row>
      ))}
    </div>
  ),
  {
    name: 'ProCardLoading',
    inheritAttrs: false,
  },
)

export default CardLoading
