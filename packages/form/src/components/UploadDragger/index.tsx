import type { VueNode } from '@v-c/util'
import type { CustomSlotsType } from '@v-c/util/dist/type'
import type { UploadProps } from 'antdv-next'
import type { DraggerProps } from 'antdv-next/dist/upload/index'
import type { SetupContext, VNode } from 'vue'
import type { ProFormFieldItemProps } from '../../typing'
import { useIntl } from '@antdv-next1/pro-provider'
import { childrenToArray, omitUndefined } from '@antdv-next1/pro-utils'
import { unit } from '@antdv-next/cssinjs'
import { InboxOutlined } from '@antdv-next/icons'
import { UploadDragger } from 'antdv-next'
import { useConfig } from 'antdv-next/config-provider/context'
import { computed, defineComponent } from 'vue'
import { useEditOrReadOnlyContextInject } from '../../BaseForm'
import { createField } from '../../BaseForm/createField'

export type ProFormUploadDraggerProps<T extends Record<string, any>> = ProFormFieldItemProps<DraggerProps<T>> & {
  /**
   * @name icon  上传文件块的图标
   * @default UploadOutlined
   *
   * @example 改成笑脸图标  icon={<SmileOutlined/>}
   */
  icon?: VueNode
  /**
   * @name title 上传文件块的标题
   * @default 单击或拖动文件到此区域进行上传
   *
   * @example  title="上传"
   * @example  title={<div>上传</div>}
   */
  title?: VueNode
  /**
   * @name description 上传文件块的说明，比标题小一点，但是字数可以更多
   * @default 支持单次或批量上传
   *
   * @example  description="支持xxx文件"
   * @example  description={<div>支持xxx文件</div>}
   */
  description?: VueNode
  /**
   * @name max 最大的文件数量，到达数量之后上传按钮会失效
   *
   * @example max=2
   */
  max?: number
  /**
   * @name value 上传组件的 fileList，为了配合form，改成了这个名字
   * @default []
   *
   * example:value={ [{uid: '-1', name: 'xxx.png', status: 'done', url: 'http://www.baidu.com/xxx.png'}] }
   */
  value?: UploadProps['fileList']
  onChange?: UploadProps['onChange']
  action?: UploadProps['action']
  accept?: UploadProps['accept']
}

const BaseProFormUploadDragger = defineComponent(<T extends Record<string, any>>(props: ProFormUploadDraggerProps<T>, { expose, slots }: SetupContext<{}, CustomSlotsType<{
  default?: () => VueNode
}>>) => {
  const intl = useIntl()
  const config = useConfig()
  const modeContext = useEditOrReadOnlyContextInject()
  const prefixCls = computed(() => config.value.getPrefixCls('pro'))
  const baseClassName = computed(() => `${prefixCls.value}-upload`)

  expose({})
  return () => {
    const { fieldProps, title = intl.value.getMessage({ id: 'form.upload.draggerTitle', defaultMessage: '单击或拖动文件到此区域进行上传' }), icon = <InboxOutlined />, description = intl.value.getMessage({ id: 'form.upload.draggerDescription', defaultMessage: '支持单次或批量上传' }), action, accept, onChange, value, max, proFieldProps } = props
    const mode = proFieldProps?.mode || modeContext.mode.value || 'edit'
    // 如果配置了 max ，并且 超过了文件列表的大小，就不展示按钮
    const showUploadButton
      = (max === undefined || !value || value?.length < max)
        && mode !== 'read'
        && proFieldProps?.readonly !== true
    // 参考 antd：不传 id 给 Upload，避免点击 label 触发 file input 打开文件选择器
    const { id: _id, ...uploadFieldProps } = fieldProps || {}

    const children = childrenToArray(slots.default?.() as VNode[], true)
    return (
      <UploadDragger
        name="files"
        action={action}
        accept={accept}
        fileList={value}
        {...{
          ...omitUndefined(uploadFieldProps),
          onChange: (info) => {
            onChange?.(info)
            if (uploadFieldProps?.onChange) {
              uploadFieldProps?.onChange(info)
            }
          },
        } as UploadProps}
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          ...uploadFieldProps?.style,
          display: !showUploadButton
            ? 'none'
            : uploadFieldProps?.style?.display || 'flex',
        }}
      >
        <p class={`${baseClassName.value}-drag-icon`}>{icon}</p>
        <p class={`${baseClassName.value}-text`}>{title}</p>
        <p class={`${baseClassName.value}-hint`}>{description}</p>
        {children.length ? (
          <div
            class={`${baseClassName.value}-extra`}
            style={{
              padding: unit(16),
            }}
          >
            {children}
          </div>
        ) : null}
      </UploadDragger>
    )
  }
}, {
  name: 'BaseProFormUploadDragger',
  inheritAttrs: false,
  props: ['_internalItemRender', 'accept', 'action', 'addonAfter', 'addonBefore', 'addonWarpStyle', 'allowClear', 'bordered', 'colProps', 'colSize', 'colon', 'convertValue', 'dataFormat', 'dependencies', 'description', 'disabled', 'emptyText', 'extra', 'fieldConfig', 'fieldId', 'fieldProps', 'footerRender', 'formItemProps', 'getValueFromEvent', 'getValueProps', 'hasFeedback', 'help', 'hidden', 'htmlFor', 'icon', 'id', 'ignoreFormItem', 'initialValue', 'isListField', 'label', 'labelAlign', 'labelCol', 'layout', 'lightProps', 'max', 'messageVariables', 'mode', 'name', 'noStyle', 'onChange', 'params', 'placeholder', 'prefixCls', 'proFieldProps', 'proFormFieldKey', 'readonly', 'record', 'required', 'rootClass', 'rules', 'secondary', 'status', 'title', 'tooltip', 'transform', 'trigger', 'validateDebounce', 'validateFirst', 'validateStatus', 'validateTrigger', 'value', 'valuePropName', 'vertical', 'width', 'wrapperCol'],
})

const ProFormUploadDragger = createField<ProFormUploadDraggerProps<Record<string, any>>>(BaseProFormUploadDragger, {
  getValueFromEvent: (value: { fileList: UploadProps['fileList'] }) =>
    value.fileList,
  valuePropName: 'fileList',
})

ProFormUploadDragger.inheritAttrs = false
ProFormUploadDragger.displayName = 'ProFormUploadDragger'

export default ProFormUploadDragger
