import type { MessageType } from 'antdv-next/dist/message/interface'
import type { FunctionalComponent } from 'vue'
import type { ProSettings } from '../../defaultSettings'
import type { themeConfig } from '../../utils'
import { Listy } from '@antdv-next1/pro-listy'
import { CopyToClipboard, useMountMergeState } from '@antdv-next1/pro-utils'
import { CloseOutlined, CopyOutlined, NotificationOutlined, SettingOutlined } from '@antdv-next/icons'
import { classNames, omit } from '@v-c/util'
import { Alert, Button, Divider, Drawer, message as Message, Switch } from 'antdv-next'
import { useConfig } from 'antdv-next/dist/config-provider/context'
import { computed, defineComponent, reactive, ref, shallowRef, Teleport } from 'vue'
import defaultSettings from '../../defaultSettings'
import { genStringToTheme } from '../../utils'
import BlockCheckbox from './BlockCheckbox'
import { GroupIcon } from './icon/group'
import { SubIcon } from './icon/sub'
import { getFormatMessage, LayoutSetting, renderLayoutSettingItem } from './LayoutChange'
import RegionalSetting from './RegionalChange'
import useStyle from './style'
import ThemeColor from './ThemeColor'

type MergerSettingsType<T> = Partial<T> & {
  colorPrimary?: string
  colorWeak?: boolean
  [key: string]: any
}
export interface SettingDrawerProps {
  settings?: MergerSettingsType<ProSettings>
  prefixCls?: string
  collapsed?: boolean
  colorList?: { key: string, color: string, title?: string }[] | false
  hideHintAlert?: boolean
  hideCopyButton?: boolean
  onSettingChange?: (config: MergerSettingsType<ProSettings>) => void
  onCollapse?: (collapsed: boolean) => void
  'onUpdate:collapsed'?: (collapsed: boolean) => void
}
interface BodyProps {
  title?: string
  prefixCls: string
  cssVarCls: string
  hashId: string
}

const SeetingBody: FunctionalComponent<BodyProps> = ({ hashId, prefixCls, title, cssVarCls }, { slots }) => (
  <div style={{ marginBlockEnd: '12px' }}>
    <h3 class={classNames(`${prefixCls}-body-title`, hashId, cssVarCls)}>{title}</h3>
    {slots.default?.()}
  </div>
)

function genCopySettingJson(settingState: MergerSettingsType<ProSettings>) {
  return JSON.stringify(
    omit(
      {
        ...settingState,
        colorPrimary: settingState.colorPrimary,
      },
      ['colorWeak'],
    ),
    null,
    2,
  )
}

/**
 * 可视化配置组件
 *
 * @param props
 */
const SettingDrawer = defineComponent<SettingDrawerProps>((props) => {
  const config = useConfig()
  const [message, ContextHolder] = Message.useMessage()
  const hideMessage = ref<MessageType>()
  const baseClassName = computed(() => `${props.prefixCls || config.value.getPrefixCls('pro')}-setting-drawer`)
  const formatMessage = getFormatMessage()
  const drawerRef = shallowRef(null)

  const [hashId, cssVarCls] = useStyle(baseClassName)
  const [open, setOpen] = useMountMergeState(false, {
    value: props.collapsed === undefined ? undefined : ref(props.collapsed),
    onChange: value => props['onUpdate:collapsed']?.(value) && props.onCollapse?.(value),
  })
  const className = computed(() =>
    classNames(baseClassName.value, hashId?.value, cssVarCls?.value, {
      [`${baseClassName.value}-collapsed`]: !open.value,
      [`${baseClassName.value}-realDark`]: props.settings?.navTheme === 'realDark',
    }),
  )
  const [settingState, setSettingState] = useMountMergeState<Partial<ProSettings>>(defaultSettings, {
    value: props.settings === undefined ? undefined : computed(() => props.settings || {}),
    onChange: props.onSettingChange,
  })
  const nextState = reactive(settingState.value as MergerSettingsType<ProSettings>)
  /**
   * 修改设置
   *
   * @param key
   * @param value
   */

  const changeSetting = (key: string, value: string | boolean) => {
    nextState[key] = value
    if (key === 'layout') {
      nextState.contentWidth = value === 'top' ? 'Fixed' : 'Fluid'
      if (!['mix', 'side', 'left'].includes(value as string)) {
        nextState.siderMenuType = 'sub'
      }
    }
    if (key === 'layout' && value !== 'mix') {
      nextState.splitMenus = false
    }
    if (key === 'layout' && value === 'mix') {
      nextState.fixedHeader = true
    }
    if (key === 'layout' && value === 'left') {
      // nextState.fixedSiderbar = true
      nextState.fixedHeader = true
      nextState.splitMenus = true
    }
    delete nextState.fixSiderbar
    if (key === 'colorWeak') {
      const dom = document.querySelector('body')
      if (!dom)
        return
      if (value) {
        dom.dataset.prosettingdrawer = dom.style.filter
        dom.style.filter = 'invert(80%)'
      }
      else {
        dom.style.filter = dom.dataset.prosettingdrawer || 'none'
        delete dom.dataset.prosettingdrawer
      }
    }

    delete nextState.menu
    delete nextState.title
    delete nextState.iconfontUrl
    delete nextState.logo
    delete nextState.pwa
    setSettingState({ ...settingState.value, ...nextState })
  }

  return () => {
    const {
      colorList = [
        { key: 'techBlue', color: '#1677FF' },
        { key: 'daybreak', color: '#1890FF' },
        { key: 'dust', color: '#F5222D' },
        { key: 'volcano', color: '#FA541C' },
        { key: 'sunset', color: '#FAAD14' },
        { key: 'cyan', color: '#13C2C2' },
        { key: 'green', color: '#52C41A' },
        { key: 'geekblue', color: '#2F54EB' },
        { key: 'purple', color: '#722ED1' },
      ],
      hideCopyButton,
      hideHintAlert,
    } = props
    const copyMessage = formatMessage({ id: 'app.setting.copyinfo', defaultMessage: '拷贝成功，请到 src/defaultSettings.js 中替换默认配置' })
    return (
      <>
        <Teleport to="body">
          {!open.value && (
            <div>
              <div class={classNames(`${baseClassName.value}-handle-container`, hashId?.value, cssVarCls?.value)}>
                <div class={classNames(`${baseClassName.value}-handle`, hashId?.value, cssVarCls?.value)} onClick={() => setOpen(!open.value)}>
                  <SettingOutlined spin style={{ color: 'rgb(255,255,255)', fontSize: '20px' }} />
                </div>
              </div>
            </div>
          )}
        </Teleport>
        <Drawer
          open={open.value}
          closable={false}
          size={300}
          rootClass={className.value}
          onClose={() => setOpen(false)}
          placement="right"
          drawerRender={(dom) => {
            return (
              <>
                <div ref={drawerRef} class={classNames(`${baseClassName.value}-handle`, hashId?.value, cssVarCls?.value)} onClick={() => setOpen(!open.value)}>
                  {!open.value
                    ? (
                        <SettingOutlined spin style={{ color: 'rgb(255,255,255)', fontSize: '20px' }} />
                      )
                    : (
                        <CloseOutlined style={{ color: 'rgb(255,255,255)', fontSize: '20px' }} />
                      )}
                </div>
                {dom}
              </>
            )
          }}
        >
          <div class={classNames(`${baseClassName.value}-content`, hashId?.value, cssVarCls?.value)}>
            <SeetingBody
              prefixCls={baseClassName.value}
              hashId={hashId?.value as string}
              cssVarCls={cssVarCls?.value as string}
              title={formatMessage({
                id: 'app.setting.pagestyle',
                defaultMessage: '整体风格设置',
              })}
            >
              <BlockCheckbox
                hashId={hashId?.value!}
                cssVarCls={cssVarCls?.value!}
                prefixCls={baseClassName.value}
                list={[
                  {
                    key: 'light',
                    title: formatMessage({
                      id: 'app.setting.pagestyle.light',
                      defaultMessage: '亮色菜单风格',
                    })!,
                  },
                  {
                    key: 'dark',
                    title: formatMessage({
                      id: 'app.setting.pagestyle.dark',
                      defaultMessage: '暗色菜单风格',
                    })!,
                  },
                  {
                    key: 'realDark',
                    title: formatMessage({
                      id: 'app.setting.pagestyle.realdark',
                      defaultMessage: '暗色风格',
                    })!,
                  },
                ]}
                configType="theme"
                key="navTheme"
                value={settingState.value.navTheme}
                onChange={value => changeSetting('navTheme', value)}
              />
            </SeetingBody>
            {colorList !== false && (
              <SeetingBody
                hashId={hashId?.value!}
                cssVarCls={cssVarCls?.value!}
                title={formatMessage({
                  id: 'app.setting.themecolor',
                  defaultMessage: '主题色',
                })}
                prefixCls={baseClassName.value}
              >
                <ThemeColor
                  hashId={hashId?.value!}
                  cssVarCls={cssVarCls?.value!}
                  prefixCls={baseClassName.value}
                  colorList={colorList}
                  formatMessage={formatMessage}
                  value={genStringToTheme(settingState.value.colorPrimary as keyof typeof themeConfig)!}
                  onChange={async (color) => {
                    if (color !== settingState.value.colorPrimary) {
                      hideMessage.value = Message.loading(
                        formatMessage({
                          id: 'app.setting.loading',
                          defaultMessage: '正在加载主题',
                        }),
                        0,
                      )
                    }
                    changeSetting('colorPrimary', color)
                    if (hideMessage.value) {
                      hideMessage.value?.()
                    }
                  }}
                />
              </SeetingBody>
            )}
            <Divider />
            <SeetingBody
              hashId={hashId?.value!}
              cssVarCls={cssVarCls?.value!}
              title={formatMessage({
                id: 'app.setting.navigationmode',
                defaultMessage: '导航模式',
              })}
              prefixCls={baseClassName.value}
            >
              <BlockCheckbox
                prefixCls={baseClassName.value}
                value={settingState.value.layout}
                key="layout"
                hashId={hashId?.value}
                cssVarCls={cssVarCls?.value}
                configType="layout"
                list={[
                  {
                    key: 'side',
                    title: formatMessage({
                      id: 'app.setting.sidemenu',
                      defaultMessage: '侧边菜单布局',
                    })!,
                  },
                  {
                    key: 'top',
                    title: formatMessage({
                      id: 'app.setting.topmenu',
                      defaultMessage: '顶部菜单布局',
                    })!,
                  },
                  {
                    key: 'mix',
                    title: formatMessage({
                      id: 'app.setting.mixmenu',
                      defaultMessage: '混合菜单布局',
                    })!,
                  },
                  {
                    key: 'left',
                    title: formatMessage({
                      id: 'app.setting.leftmenu',
                      defaultMessage: '左侧混合布局',
                    })!,
                  },
                ]}
                onChange={value => changeSetting('layout', value)}
              />
            </SeetingBody>
            {settingState.value.layout === 'side' || settingState.value.layout === 'mix' || settingState.value.layout === 'left'
              ? (
                  <SeetingBody
                    hashId={hashId?.value!}
                    cssVarCls={cssVarCls?.value!}
                    prefixCls={baseClassName.value}
                    title={formatMessage({
                      id: 'app.setting.sidermenutype',
                      defaultMessage: '侧边菜单类型',
                    })}
                  >
                    <BlockCheckbox
                      prefixCls={baseClassName.value}
                      value={settingState.value.siderMenuType}
                      key="siderMenuType"
                      hashId={hashId?.value}
                      cssVarCls={cssVarCls?.value}
                      configType="siderMenuType"
                      list={[
                        {
                          key: 'sub',
                          icon: <SubIcon dark={props.settings?.navTheme === 'realDark'} />,
                          title: formatMessage({
                            id: 'app.setting.sidermenutype-sub',
                            defaultMessage: '经典模式',
                          })!,
                        },
                        {
                          key: 'group',
                          icon: <GroupIcon dark={props.settings?.navTheme === 'realDark'} />,
                          title: formatMessage({
                            id: 'app.setting.sidermenutype-group',
                            defaultMessage: '分组模式',
                          })!,
                        },
                      ]}
                      onChange={value => changeSetting('siderMenuType', value)}
                    />
                  </SeetingBody>
                )
              : null}
            <LayoutSetting
              prefixCls={baseClassName.value}
              hashId={hashId?.value!}
              cssVarCls={cssVarCls?.value!}
              formatMessage={formatMessage}
              settings={{
                ...settingState.value,
              }}
              changeSetting={changeSetting}
            />
            <Divider />
            <SeetingBody
              hashId={hashId?.value!}
              cssVarCls={cssVarCls?.value!}
              prefixCls={baseClassName.value}
              title={formatMessage({
                id: 'app.setting.regionalsettings',
                defaultMessage: '内容区域',
              })}
            >
              <RegionalSetting
                hashId={hashId?.value!}
                cssVarCls={cssVarCls?.value!}
                prefixCls={baseClassName.value}
                formatMessage={formatMessage}
                settings={{
                  ...settingState.value,
                }}
                changeSetting={changeSetting}
              />
            </SeetingBody>
            <Divider />
            <SeetingBody
              hashId={hashId?.value!}
              cssVarCls={cssVarCls?.value!}
              prefixCls={baseClassName.value}
              title={formatMessage({
                id: 'app.setting.othersettings',
                defaultMessage: '其他设置',
              })}
            >
              <Listy
                class={classNames(`${baseClassName.value}-list`, hashId?.value, cssVarCls?.value)}
                split={false}
                size="small"
                rowKey="title"
                variant="borderless"
                itemRender={item => renderLayoutSettingItem(item)}
                items={[
                  {
                    title: formatMessage({
                      id: 'app.setting.weakmode',
                      defaultMessage: '色弱模式',
                    }),
                    action: (
                      <Switch
                        size="small"
                        class="color-weak"
                        checked={!!settingState.value.colorWeak}
                        onUpdate:checked={checked => changeSetting('colorWeak', checked as boolean)}
                        onChange={checked => changeSetting('colorWeak', checked as boolean)}
                      />
                    ),
                  },
                ]}
              />
            </SeetingBody>
            {hideHintAlert && hideCopyButton ? null : <Divider />}
            {hideHintAlert
              ? null
              : (
                  <Alert
                    type="warning"
                    message={formatMessage({
                      id: 'app.setting.production.hint',
                      defaultMessage: '配置栏只在开发环境用于预览，生产环境不会展现，请拷贝后手动修改配置文件',
                    })}
                    icon={<NotificationOutlined />}
                    showIcon
                    style={{ marginBlockEnd: '16px' }}
                  />
                )}
            {hideCopyButton
              ? null
              : (
                  <CopyToClipboard
                    text={genCopySettingJson(settingState.value)}
                    onCopy={() =>
                      message.info(copyMessage)}
                  >
                    <ContextHolder />
                    <Button block icon={<CopyOutlined />} style={{ marginBlockEnd: '24px' }}>
                      {formatMessage({ id: 'app.setting.copy' })}
                    </Button>
                  </CopyToClipboard>
                )}
          </div>
        </Drawer>
      </>
    )
  }
}, {
  name: 'SettingDrawer',
  inheritAttrs: false,
})

export default SettingDrawer
