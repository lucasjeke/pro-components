import type { FunctionalComponent } from 'vue'
import { CheckOutlined } from '@antdv-next/icons'
import { classNames } from '@v-c/util'
import { Tooltip } from 'antdv-next'
import Wave from 'antdv-next/dist/_util/wave/index'

export interface TagProps {
  color: string
  check: boolean
  class?: string
  onClick?: () => void
}

const Tag: FunctionalComponent<TagProps> = ({ color, check, ...rest }) => {
  return (
    <div {...rest} style={{ backgroundColor: color }}>
      {check ? <CheckOutlined /> : ''}
    </div>
  )
}

export interface ThemeColorProps {
  colorList?: {
    key: string
    color: string
    title?: string
  }[]
  prefixCls: string
  value: string
  onChange: (color: string) => void
  formatMessage: (data: { id: string, defaultMessage?: string }) => string | undefined
  hashId: string
  cssVarCls: string
}
const ThemeColor: FunctionalComponent<ThemeColorProps> = ({ value, colorList, onChange, prefixCls, formatMessage, hashId, cssVarCls }) => {
  if (!colorList || colorList?.length < 1) {
    return null
  }
  const baseClassName = `${prefixCls}-theme-color`
  return (
    <div class={classNames(`${baseClassName}`, hashId, cssVarCls)}>
      {colorList?.map(({ key, color, title }) => {
        if (!key)
          return null
        return (
          <Tooltip
            key={color}
            title={
              title
              ?? formatMessage({
                id: `app.setting.themecolor.${key}`,
              })
            }
          >
            <Wave component="Tag" disabled={(value.startsWith('#') ? value.toUpperCase() : value) === color}>
              <Tag
                class={classNames(`${baseClassName}-block`, hashId, cssVarCls)}
                color={color}
                check={(value.startsWith('#') ? value.toUpperCase() : value) === color}
                onClick={() => onChange && onChange(color)}
              />
            </Wave>
          </Tooltip>
        )
      })}
    </div>
  )
}
export default ThemeColor
