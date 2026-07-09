import type { VueNode } from '@v-c/util'
import type { ButtonProps, ImageProps, UploadProps } from 'antdv-next'
import type { UploadFile, VcFile } from 'antdv-next/dist/upload/interface'
import type { ProFormFieldItemProps } from '../../typing'
import { useIntl } from '@antdv-next1/pro-provider'
import { useState } from '@antdv-next1/pro-utils'
import { UploadOutlined } from '@antdv-next/icons'
import { Button, Image, Upload } from 'antdv-next'
import { computed, defineComponent } from 'vue'
import { useEditOrReadOnlyContextInject } from '../../BaseForm'
import { createField } from '../../BaseForm/createField'

type PickUploadProps = Pick<
  UploadProps,
  'listType' | 'action' | 'accept' | 'fileList' | 'onChange'
>

export type ProFormUploadButtonProps = ProFormFieldItemProps<
  UploadProps
> & {
  /**
   * @name icon 上传文件的图标
   * @default UploadOutlined
   *
   * @example 改成笑脸图标  icon={<SmileOutlined/>}
   */
  icon?: VueNode
  /**
   * @name title 按钮文字
   * @default 单击上传
   *
   * @example  title="上传"
   * @example  title={<div>上传</div>}
   */
  title?: VueNode
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
  /**
   * @name buttonProps 上传按钮的配置
   *
   * @example 按钮修改为主色 buttonProps={{ type:"primary" }}
   */
  buttonProps?: ButtonProps

  /**
   * @name disabled 是否禁用按钮
   * @example  disabled={true}
   */
  disabled?: ButtonProps['disabled']
  /**
   * @name imageProps 图片预览组件的配置
   * @example imageProps={{ preview: { toolbarRender: () => null } }}
   */
  imageProps?: Omit<ImageProps, 'src'>
} & PickUploadProps

function getBase64(file: VcFile): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}

const BaseProFormUploadButton = defineComponent<ProFormUploadButtonProps>((props) => {
  const intl = useIntl()
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const modeContext = useEditOrReadOnlyContextInject()
  const value = computed(() => {
    return props.fileList ?? props.value
  })
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as VcFile)
    }
    setPreviewImage(file.url || (file.preview as string))
    setPreviewOpen(true)
  }

  return () => {
    const { fieldProps, action, accept, listType, title = intl.value.getMessage({ id: 'form.upload.buttonText', defaultMessage: '单击上传' }), max, icon = <UploadOutlined />, buttonProps, disabled, proFieldProps, imageProps,

    } = props
    const mode = proFieldProps?.mode || modeContext.mode.value || 'edit'
    // 如果配置了 max ，并且 超过了文件列表的大小，就不展示按钮
    const showUploadButton
      = (max === undefined || !value.value || value.value?.length < max) && mode !== 'read'
    const isPictureCard
      = (listType ?? fieldProps?.listType) === 'picture-card'
      // 参考 antd：不传 id 给 Upload，避免点击 label 触发 file input 打开文件选择器
    const { id: _id, ...uploadFieldProps } = fieldProps || {}
    return (
      <>
        <Upload
          action={action}
          accept={accept}
          listType={listType || 'picture'}
          fileList={value.value}
          onPreview={handlePreview}
          {...uploadFieldProps}
          name={uploadFieldProps?.name ?? 'file'}
          onChange={info => uploadFieldProps?.onChange?.(info)}
        >
          {showUploadButton
            && (isPictureCard ? (
              <span>
                {icon}
                {' '}
                {title}
              </span>
            ) : (
              <Button
                disabled={disabled || uploadFieldProps?.disabled}
                {...buttonProps}
              >
                {icon}
                {title}
              </Button>
            ))}
        </Upload>
        {previewImage && (
          <Image
            styles={{ root: { display: 'none' } }}
            {...imageProps}
            preview={{
              open: previewOpen.value,
              onOpenChange: (open: boolean) => setPreviewOpen(open),
              afterOpenChange: (open: boolean) =>
                !open && setPreviewImage(''),
              ...(typeof imageProps?.preview !== 'boolean' ? imageProps?.preview : {}),
            }}
            src={previewImage.value}
          />
        )}
      </>
    )
  }
}, {
  name: 'BaseProFormUploadButton',
  inheritAttrs: false,
})

const ProFormUploadButton = createField<ProFormUploadButtonProps>(BaseProFormUploadButton, {
  getValueFromEvent: (value: { fileList: UploadProps['fileList'] }) =>
    value.fileList,
  valuePropName: 'fileList',
})

ProFormUploadButton.inheritAttrs = false
ProFormUploadButton.displayName = 'ProFormUploadButton'

export default ProFormUploadButton
