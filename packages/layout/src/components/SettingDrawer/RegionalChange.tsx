import type { FunctionalComponent } from 'vue'
import type { RenderSetting } from '../../defaultSettings'
import type { MessageDescriptor } from '../../typing'
import { Listy } from '@antdv-next1/pro-listy'
import { classNames } from '@v-c/util'
import { Switch } from 'antdv-next'
import { renderLayoutSettingItem } from './LayoutChange'

const RegionalSetting: FunctionalComponent<{
  settings: Partial<RenderSetting>
  changeSetting: (key: string, value: any, hideLoading?: boolean) => void
  hashId: string
  cssVarCls: string
  prefixCls: string
  formatMessage: (data: MessageDescriptor) => string | undefined
}> = ({ settings = {}, prefixCls, changeSetting, formatMessage, cssVarCls, hashId }) => {
  const regionalSetting = ['header', 'footer', 'siderMenu', 'menuHeader']
  return (
    <Listy
      split={false}
      class={classNames(`${prefixCls}-list`, hashId, cssVarCls)}
      itemRender={item => renderLayoutSettingItem(item)}
      rowKey="title"
      variant="borderless"
      items={regionalSetting.map((key) => {
        return {
          title: formatMessage({ id: `app.setting.regionalsettings.${key}` }),
          action: (
            <Switch
              size="small"
              class={classNames(`regional-${key}`, hashId, cssVarCls)}
              checked={
                (settings[`${key}Render` as 'headerRender']
                  || settings[`${key}Render` as 'headerRender']) === undefined
              }
              onChange={checked =>
                changeSetting(`${key}Render`, checked === true ? undefined : false)}
            />
          ),
        }
      })}
    />
  )
}
export default RegionalSetting
