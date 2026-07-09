import type { ProFieldValueObjectType, ProFieldValueType, VueNode } from '@antdv-next1/pro-utils'
import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { SetupContext } from 'vue'
import type { ProColumns } from '../../typing'
import { useIntl } from '@antdv-next1/pro-provider'
import { useEffect } from '@antdv-next1/pro-utils'
import { SettingOutlined } from '@antdv-next/icons'
import { classNames } from '@v-c/util'
import { Checkbox, Popover, Space, Tooltip } from 'antdv-next'
import { useConfig } from 'antdv-next/dist/config-provider/context'
import { computed, defineComponent, shallowRef } from 'vue'
import { useTableContextInject } from '../../Store/Provide'
import { genColumnKey } from '../../utils/genProColumnsToColumns'
import GroupCheckboxList from './GroupCheckboxList'
import useStyle from './style'

export interface ColumnSettingProps<T, ValueType> {
  prefixCls?: string
  draggable?: boolean
  checkable?: boolean
  showListItemOption?: boolean
  checkedReset?: boolean
  listsHeight?: number
  extra?: VueNode
  settingIcon?: VueNode
  columns?: ProColumns<T, ValueType>[]
}

const ColumnSetting = defineComponent(<T extends Record<string, any>, U extends Record<string, any>, ValueType extends (ProFieldValueType | ProFieldValueObjectType) = 'text'>(props: ColumnSettingProps<T, ValueType>, { slots }: SetupContext<{}, CustomSlotsType<{
  default?: () => VueNode
}>>) => {
  const intl = useIntl()
  const config = useConfig()
  const prefixCls = computed(() => props.prefixCls || config.value.getPrefixCls('pro'))
  const baseClassName = computed(() => `${prefixCls.value}-table-column-setting`)
  const [hashId, cssVarCls] = useStyle(baseClassName)
  const counter = useTableContextInject<T, U, ValueType>()
  const columnRef = shallowRef(null)
  /**
   * 设置全部选中，或全部未选中
   *
   * @param show
   */
  const setAllSelectAction = (show: boolean = true) => {
    const columnKeyMap = {} as Record<string, any>
    const loopColumns = (columns?: ProColumns<T, ValueType>[]) => {
      columns?.forEach(({ key, fixed, index, children, disable }) => {
        const columnKey = genColumnKey(key, index)
        if (columnKey) {
          columnKeyMap[columnKey] = {
            // 子节点 disable 时，不修改节点显示状态
            show: disable ? counter.columnsMap?.value?.[columnKey]?.show : show,
            fixed,
            disable,
            order: counter.columnsMap?.value?.[columnKey]?.order,
          }
        }
        if (children) {
          loopColumns(children)
        }
      })
    }
    loopColumns(props.columns)
    counter.setColumnsMap?.(columnKeyMap)
  }

  useEffect(() => {
    if (counter.propsRef?.value?.columnsState?.value) {
      columnRef.value = JSON.parse(
        JSON.stringify(counter.propsRef.value?.columnsState?.value || {}),
      )
    }
  }, [() => counter.propsRef?.value?.columnsState?.value])

  /** 重置项目 */
  const clearClick = () => {
    counter.clearPersistenceStorage?.()
    counter.setColumnsMap?.(
      counter.propsRef?.value?.columnsState?.defaultValue
      || columnRef.value
      || counter.defaultColumnKeyMap?.value!,
    )
  }

  return () => {
    const {
      settingIcon,
      checkable,
      draggable,
      checkedReset = true,
      extra,
      listsHeight,
      showListItemOption,
      columns = [],
    } = props
    // 未选中的 key 列表
    const unCheckedKeys = Object.values(counter.columnsMap?.value! || {}).filter(
      value => !value || value.show === false,
    )

    // 是否已经选中
    const indeterminate = unCheckedKeys.length > 0 && unCheckedKeys.length !== columns.length
    return (
      <Popover
        arrow={false}
        trigger="click"
        placement="bottomRight"
        title={(
          <div class={classNames(`${baseClassName.value}-title`, hashId.value, cssVarCls.value)}>
            {checkable === false ? null : (
              <Checkbox
                indeterminate={indeterminate}
                checked={unCheckedKeys.length === 0 && unCheckedKeys.length !== columns.length}
                onChange={(e) => {
                  if (e.target.checked) {
                    setAllSelectAction()
                  }
                  else {
                    setAllSelectAction(false)
                  }
                }}
              >
                {intl.value.getMessage({
                  id: 'tableToolBar.columnDisplay',
                  defaultMessage: '列展示',
                })}
              </Checkbox>
            )}
            {checkedReset ? (
              <a
                class={classNames(`${baseClassName.value}-action-rest-button`, hashId.value, cssVarCls.value)}
                onClick={clearClick}
              >
                {intl.value.getMessage({ id: 'tableToolBar.reset', defaultMessage: '重置' })}
              </a>
            ) : null}
            {!extra ? null : (
              <Space size={12} align="center">
                {extra}
              </Space>
            )}
          </div>
        )}
        classes={{
          root: classNames(`${baseClassName.value}-overlay`, hashId.value, cssVarCls.value),
        }}
        content={(
          <GroupCheckboxList
            class={baseClassName.value}
            checkable={checkable ?? true}
            draggable={draggable ?? true}
            showListItemOption={showListItemOption ?? true}
            columns={columns}
            listsHeight={listsHeight}
          />
        )}
      >
        {slots.default?.() || (
          <Tooltip
            title={intl.value.getMessage({
              id: 'tableToolBar.columnSetting',
              defaultMessage: '列设置',
            })}
          >
            {settingIcon ?? <SettingOutlined />}
          </Tooltip>
        )}
      </Popover>
    )
  }
}, {
  name: 'ColumnSetting',
  inheritAttrs: false,
  props: ['checkable', 'checkedReset', 'columns', 'draggable', 'extra', 'listsHeight', 'prefixCls', 'settingIcon', 'showListItemOption'],

})
export default ColumnSetting
