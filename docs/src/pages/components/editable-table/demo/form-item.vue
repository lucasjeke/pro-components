<docs lang="zh-CN">
与 FormItem 配合
</docs>

<docs lang="en-US">
With Form.Item
</docs>

<script setup lang="ts">
import type { EditableProTableInstance, Key, ProColumns, ProFormInstance } from '@antdv-next1/pro-components'
import { EditableProTable, ProForm, ProFormSegmented, ProFormSwitch } from '@antdv-next1/pro-components'
import { Button } from 'antdv-next'
import { h } from 'vue'

interface DataSourceType {
  id: Key
  title?: string
  decs?: string
  state?: string
  created_at?: number
  update_at?: number
  children?: DataSourceType[]
}
const defaultData: DataSourceType[] = [
  {
    id: '624748504',
    title: '优化首页加载速度',
    decs: '首页白屏时间超过 3s，需优化资源加载和首屏渲染',
    state: 'open',
    created_at: 1705286400000,
    update_at: 1705372800000,
  },
  {
    id: '624691229',
    title: '修复登录超时问题',
    decs: '用户反馈高峰期登录请求超时，需排查连接池配置',
    state: 'closed',
    created_at: 1705200000000,
    update_at: 1705286400000,
  },
]
const editableKeys = shallowRef<Key[]>([])
const position = shallowRef<'top' | 'bottom' | 'hidden'>(
  'bottom',
)
const controlled = shallowRef<boolean>(false)
const formRef = useTemplateRef<ProFormInstance<Record<string, any>>>('formRef')
const editableProTableRef = useTemplateRef<EditableProTableInstance<DataSourceType>>('editableProTable')
const index = shallowRef<number>(0)
console.log(editableProTableRef, 'editableProTableRef')
const columns: ProColumns<DataSourceType>[] = [
  {
    title: '任务名称',
    dataIndex: 'title',
    formItemProps: (_form, _config) => {
      return ({
        rules: [
          // 自定义 validator 放前面，空值时显式通过，避免干扰 required
          {
            warningOnly: true,
            validator: (_rule: any, value: any) => {
              if (!value) {
                return Promise.resolve()
              }
              if (value === 'warningOnly') {
                throw new Error('Warning Only')
              }
              return Promise.resolve()
            },
          },
          { required: true, message: '此项为必填项' },
        ],
      })
    },
    width: '30%',
  },
  {
    title: '状态',
    key: 'state',
    dataIndex: 'state',
    valueType: 'select',
    valueEnum: {
      all: { text: '全部', status: 'Default' },
      open: {
        text: '未解决',
        status: 'Error',
      },
      closed: {
        text: '已解决',
        status: 'Success',
      },
    },
  },
  {
    title: '描述',
    dataIndex: 'decs',
  },
  {
    title: '活动时间',
    dataIndex: 'created_at',
    valueType: 'date',
  },
  {
    title: '操作',
    valueType: 'option',
    width: 300,
    render: (_1, record, _, action) => [
      h('a', { key: 'editable', onClick: () => action?.startEditable?.(record.id, record) }, '编辑'),
      h('a', { key: 'delete', onClick: () => {
        const tableDataSource = formRef.value?.getFieldValue(
          'table',
        ) as DataSourceType[]
        formRef.value?.setFieldsValue({
          table: tableDataSource.filter(item => item.id !== record.id),
        })
      } }, '删除'),
    ],
  },
]
let editableRowIdCounter = 1000000
function createEditableRowId(): string {
  editableRowIdCounter += 1
  return String(editableRowIdCounter)
}
</script>

<template>
  <div class="p-6">
    <ProForm
      ref="formRef"
      validate-trigger="onBlur"
      :model="{
        table: defaultData,
      }"
      @finish="(values) => {
        console.log(values, 'values')
      }"
    >
      <EditableProTable
        ref="editableProTable"
        row-key="id"
        :scroll="{
          x: 960,
        }"
        header-title="可编辑表格"
        :max-length="5"
        name="table"
        :controlled="controlled"
        :record-creator-props="position !== 'hidden'
          ? {
            position: position as 'top',
            record: () => ({ id: createEditableRowId() }),
          }
          : false"
        :tool-bar-render="() => [
          h(ProFormSwitch, {
            key: 'render',
            fieldProps: {
              style: {
                marginBlockEnd: 0,
              },
              checked: controlled,
              onChange: (value) => {
                controlled = value;
              },
            },
            checkedChildren: '数据更新通知 Form',
            unCheckedChildren: '保存后通知 Form',
            noStyle: true,
          }),
          h(ProFormSegmented, {
            key: 'render',
            fieldProps: {
              style: {
                marginBlockEnd: 0,
              },
              value: position,
              onChange: (value) => {
                position = value as 'top';
              },
            },
            noStyle: true,
            request: async () => [
              {
                label: '添加到顶部',
                value: 'top',
              },
              {
                label: '添加到底部',
                value: 'bottom',
              },
              {
                label: '隐藏',
                value: 'hidden',
              },
            ],
          }),
          h(Button, {
              key: 'row',
              onClick: () => {
                const rows = editableProTableRef?.getRowsData?.();
                console.log(rows, 'rows');
              } },
            () => '获取 table 的数据'),

        ]"
        :columns="columns"
        :editable="{
          type: 'multiple',
          editableKeys,
          onChange: (value) => {
            editableKeys = value
          },
          actionRender: (_, config, defaultDom) => {
            return [
              defaultDom.save,
              defaultDom.delete,
              defaultDom.cancel,
              h('a', {
                key: 'set',
                onClick: () => {
                  index = index + 1
                  editableProTableRef?.setRowData?.(config.index!, {
                    title: `动态设置的title${index}`,
                  });
                },
              }, '动态设置此项'),
            ]

          },
        }"
      />
    </ProForm>
  </div>
</template>

<style scoped></style>
