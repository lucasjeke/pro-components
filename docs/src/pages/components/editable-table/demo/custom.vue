<docs lang="zh-CN">
自定义可编辑表格
</docs>

<docs lang="en-US">
Custom editable table
</docs>

<script setup lang="ts">
import type { EditableProTableInstance, Key, ProColumns } from '@antdv-next1/pro-components'
import type { InputRef } from 'antdv-next'
import { EditableProTable, EditableProTableRecordCreator } from '@antdv-next1/pro-components'
import { PlusOutlined } from '@antdv-next/icons'
import { Input, Space, Tag } from 'antdv-next'
import { defineComponent } from 'vue'

function waitTime(time: number = 100) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}

interface DataSourceType {
  id: Key
  title?: string
  labels?: {
    key: string
    label: string
  }[]
  status?: string
  created_at?: number
  children?: DataSourceType[]
}

const defaultData: DataSourceType[] = [
  {
    id: 624748504,
    title: '优化首页加载速度',
    labels: [{ key: 'perf', label: '性能优化' }],
    status: 'open',
    created_at: 1705286400000,
  },
  {
    id: 624691229,
    title: '修复登录超时问题',
    labels: [{ key: 'bug', label: '缺陷修复' }],
    status: 'closed',
    created_at: 1705200000000,
  },
]
let editableRowIdCounter = 1000000
function createEditableRowId(): string {
  editableRowIdCounter += 1
  return String(editableRowIdCounter)
}
const editableProTableRef = useTemplateRef<EditableProTableInstance<DataSourceType>>('editableProTable')

const TagList = defineComponent<{
  value?: {
    key: string
    label: string
  }[]
  onChange?: (
    value: {
      key: string
      label: string
    }[],
  ) => void
}>((props) => {
  const inputRef = shallowRef<InputRef | null>(null)
  const newTags = ref<
    {
      key: string
      label: string
    }[]
  >([])
  const inputValue = shallowRef<string | undefined>('')
  const handleInputConfirm = () => {
    let tempsTags = [...(props.value || [])]
    if (
      inputValue.value
      && tempsTags.filter(tag => tag.label === inputValue.value).length === 0
    ) {
      tempsTags = [
        ...tempsTags,
        { key: `new-${tempsTags.length}`, label: inputValue.value },
      ]
    }
    props.onChange?.(tempsTags)
    newTags.value = []
    inputValue.value = ''
  }
  return () => {
    return h(Space, null, () => [
      (props.value || []).concat(newTags.value).map(item => h(Tag, { key: item.key }, () => item.label)),
      h(Input, {
        ref: inputRef,
        type: 'text',
        size: 'small',
        style: { width: '78px' },
        value: inputValue.value,
        onChange: (e) => {
          inputValue.value = e.target.value
        },
        onBlur: handleInputConfirm,
        onPressEnter: handleInputConfirm,
      }),
    ])
  }
}, {
  name: 'TagList',
  inheritAttrs: false,
  props: ['value', 'onChange'],
})
const columns: ProColumns<DataSourceType>[] = [
  {
    title: '任务名称',
    dataIndex: 'title',
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项为必填项',
        },
      ],
    },
    width: '30%',
  },
  {
    title: '状态',
    key: 'status',
    dataIndex: 'status',
    valueType: 'select',
    valueEnum: {
      all: { text: '全部', status: 'Default' },
      open: {
        text: '待处理',
        status: 'Error',
      },
      closed: {
        text: '已完成',
        status: 'Success',
      },
    },
  },
  {
    title: '标签',
    dataIndex: 'labels',
    width: '20%',
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项为必填项',
        },
      ],
    },
    formItemRender: (_, { isEditable, ...rest }) => {
      console.log(rest.record, _, 'rest')
      return isEditable ? h(TagList) : h(Input)
    },
    render: (_, row) => h(Space, {}, () => row?.labels?.map(item => h(Tag, { key: item.key }, () => item.label))),
  },
  {
    title: '操作',
    valueType: 'option',
    width: 250,
    render: (_1, record, _, action) => [
      h('a', {
        key: 'editable',
        onClick: () => {
          action?.startEditable?.(record.id)
        },
      }, '编辑'),
      h(EditableProTableRecordCreator, {
        key: 'copy',
        record: {
          ...record,
          id: createEditableRowId(),
        },
      }, () => h('a', null, '复制此项到末尾')),
    ],
  },
]
const editableKeys = shallowRef<Key[]>([])
const dataSource = shallowRef<DataSourceType[] | undefined>([])
</script>

<template>
  <div class="p-6">
    <a-space>
      <a-button
        type="primary"
        @click="() => {
          editableProTableRef?.addEditRecord?.({
            id: createEditableRowId(),
            title: '新建任务',
          });
        }"
      >
        <template #icon>
          <PlusOutlined />
        </template>
        新建一行
      </a-button>
      <a-button
        key="rest"
        @click="() => {
          editableProTableRef?.editableFormRef.resetFields();
        }"
      >
        重置表单
      </a-button>
    </a-space>
    <EditableProTable
      ref="editableProTable"
      row-key="id"
      :scroll="{
        x: 960,
      }"
      header-title="自定义可编辑表格"
      :max-length="5"
      :record-creator-props="false"
      :columns="columns"
      :request="async() => ({
        data: defaultData,
        total: 3,
        success: true,
      })"
      :value="dataSource"
      :editable="{
        form: editableProTableRef?.editableFormRef,
        editableKeys,
        onSave: async () => {
          await waitTime(2000);
        },
        onChange: (keys) => { editableKeys = keys },
        actionRender: (_, _1, dom) => [dom.save, dom.cancel],
      }"
      @change="(data) => {
        dataSource = data
      }"
    />
  </div>
</template>

<style scoped></style>
