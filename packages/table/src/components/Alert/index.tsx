import type { IntlType } from '@antdv-next1/pro-provider'
import type { Key } from '@antdv-next1/pro-utils'
import type { AlertProps } from 'antdv-next'
import type { TableAlertRender } from '../../RenderTypings'
import { useIntl } from '@antdv-next1/pro-provider'
import { classNames } from '@v-c/util'
import { Alert, Space } from 'antdv-next'
import { useConfig } from 'antdv-next/config-provider/context'
import { computed, defineComponent } from 'vue'
import useStyle from './style'

export type TableAlertProps<T> = AlertProps & {
  selectedRowKeys?: Key[]
  selectedRows?: any[]
  alwaysShowAlert?: boolean
  alertInfoRender?: TableAlertRender<T>
  onCleanSelected?: () => void
  alertOptionRender?: TableAlertRender<T>
}

function defaultAlertOptionRender(props: { intl: IntlType, onCleanSelected: () => void }) {
  const { intl, onCleanSelected } = props
  return (
    <a onClick={onCleanSelected} key="0">
      {intl.getMessage({ id: 'alert.clear', defaultMessage: '清空' })}
    </a>
  )
}
const TableAlert = defineComponent(
  <T = Key>(props: TableAlertProps<T>) => {
    const config = useConfig()
    const prefixCls = computed(() => props.prefixCls || config.value.getPrefixCls('pro'))
    const baseClassName = computed(() => `${prefixCls.value}-table-alert`)
    const [hashId, cssVarCls] = useStyle(baseClassName)
    const intl = useIntl()

    return () => {
      const {
        selectedRowKeys = [],
        onCleanSelected,
        alwaysShowAlert,
        selectedRows,
        alertInfoRender = ({ intl }) => (
          <Space>
            {intl.getMessage({ id: 'alert.selected', defaultMessage: '已选择' })}
            {selectedRowKeys.length}
            {intl.getMessage({ id: 'alert.item', defaultMessage: '项' })}
&nbsp;&nbsp;
          </Space>
        ),
        alertOptionRender = defaultAlertOptionRender,
      } = props
      const option
        = alertOptionRender
          && alertOptionRender({
            onCleanSelected: onCleanSelected!,
            selectedRowKeys,
            selectedRows: selectedRows!,
            intl: intl.value,
          })
      if (alertInfoRender === false) {
        return null
      }
      const dom = alertInfoRender({
        intl: intl.value,
        selectedRowKeys,
        selectedRows: selectedRows!,
        onCleanSelected: onCleanSelected!,
      })

      if (dom === false || (selectedRowKeys.length < 1 && !alwaysShowAlert)) {
        return null
      }
      return (
        <Alert
          class={classNames(baseClassName.value, hashId.value, cssVarCls.value)}
          v-slots={{
            message: () => dom,
            action: () => option,
          }}
        />
      )
    }
  },
  {
    name: 'TableAlert',
    inheritAttrs: false,
    props: ['action', 'afterClose', 'alertInfoRender', 'alertOptionRender', 'alwaysShowAlert', 'banner', 'classes', 'closable', 'closeIcon', 'description', 'icon', 'id', 'message', 'onCleanSelected', 'icon', 'id', 'message', 'onCleanSelected', 'onClick', 'onClose', 'onMouseenter', 'onMouseleave', 'prefixCls', 'role', 'rootClass', 'selectedRowKeys', 'selectedRows', 'showIcon', 'styles', 'title', 'type'],
  },
)

export default TableAlert
