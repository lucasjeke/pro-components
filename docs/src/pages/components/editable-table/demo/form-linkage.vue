<docs lang="zh-CN">
与编辑表格外的内容联动
</docs>

<docs lang="en-US">
Link with content outside the edit form
</docs>

<script setup lang="ts">
import type { EditableProTableInstance, Key, ProColumns, ProFormInstance } from '@antdv-next1/pro-components'
import { EditableProTable, ProForm, ProFormDependency, ProFormDigit } from '@antdv-next1/pro-components'

interface DataSourceType {
  id: Key
  associate?: string
  questionsNum?: number
  type?: string
  fraction?: Key | Key[]
  scoringMethod?: string
}
const defaultData: DataSourceType[] = [
  {
    id: 624748504,
    associate: '前端基础知识',
    questionsNum: 10,
    type: 'multiple',
    scoringMethod: 'continuous',
    fraction: 20,
  },
  {
    id: 624691229,
    associate: 'React 框架进阶',
    questionsNum: 10,
    scoringMethod: 'continuous',
    type: 'radio',
    fraction: 20,
  },
  {
    id: 624748503,
    associate: 'TypeScript 类型系统',
    questionsNum: 10,
    type: 'judge',
    scoringMethod: 'continuous',
    fraction: 20,
  },
  {
    id: 624691220,
    associate: '算法与数据结构',
    questionsNum: 10,
    scoringMethod: 'continuous',
    type: 'vacant',
    fraction: 20,
  },
]
const editableKeys = shallowRef<Key[]>([])
const formRef = useTemplateRef<ProFormInstance<Record<string, any>>>('form')
const editableProTableRef = useTemplateRef<EditableProTableInstance<DataSourceType>>('editableProTable')
const columns: ProColumns<DataSourceType>[] = [
  {
    title: '关联题库',
    dataIndex: 'associate',
    valueType: 'text',
    ellipsis: true,
  },
  {
    title: '题型',
    key: 'type',
    dataIndex: 'type',
    valueType: 'select',
    valueEnum: {
      multiple: { text: '多选题', status: 'Default' },
      radio: { text: '单选题', status: 'Warning' },
      vacant: {
        text: '填空题',
        status: 'Error',
      },
      judge: {
        text: '判断题',
        status: 'Success',
      },
    },
  },
  {
    title: '题数',
    dataIndex: 'questionsNum',
    valueType: 'digit',
  },
  {
    title: '计分方式',
    dataIndex: 'scoringMethod',
    valueType: 'select',
    request: async () => [
      {
        value: 'discrete',
        label: '离散型',
      },
      {
        value: 'continuous',
        label: '连续型',
      },
    ],
    fieldProps: (_, { rowIndex }) => {
      return {
        onSelect: () => {
          // 每次选中重置参数
          editableProTableRef.value?.setRowData?.(rowIndex, { fraction: [] })
        },
      }
    },
  },
  {
    title: '分值',
    width: 150,
    dataIndex: 'fraction',
    valueType: (record) => {
      const scoringMethod = record?.scoringMethod
      if (scoringMethod === 'discrete')
        return 'select'
      return 'digit'
    },
    fieldProps: {
      mode: 'multiple',
    },
    request: async () =>
      ['A', 'B', 'D', 'E', 'F'].map((item, index) => ({
        label: item,
        value: index,
      })),
  },
  {
    title: '操作',
    valueType: 'option',
    width: 180,
    render: (_, row) => [
      h('a', { key: 'delete', onClick: () => {
        const tableDataSource = formRef.value?.getFieldValue(
          'table',
        ) as DataSourceType[]
        formRef.value?.setFieldsValue({
          table: tableDataSource.filter(item => item.id !== row?.id),
        })
      } }, '移除'),
      h('a', {
        key: 'edit',
        onClick: () => {
          console.log(row, editableProTableRef.value)
          editableProTableRef.value?.startEditable?.(row.id)
        },
      }, '编辑'),
    ],
  },
]
function info(table: DataSourceType[]) {
  if (table && table.length > 0) {
    return (table as DataSourceType[]).reduce(
      (pre, item) => {
        const fraction = Array.isArray(item?.fraction)
          ? 0
          : item?.fraction
        return {
          totalScore: pre.totalScore + Number.parseInt((fraction || 0).toString(), 10),
          questions: pre.questions + Number.parseInt((item?.questionsNum || 0).toString(), 10),
        }
      },
      { totalScore: 0, questions: 0 },
    )
  }
  return { totalScore: 0, questions: 0 }
}
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto">
    <ProForm
      ref="form"
      :model="{
        table: defaultData,
      }"
    >
      <ProFormDependency :name="['table']">
        <template #default="{ values: { table } }">
          <div
            :style="{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              paddingBlockEnd: '16px',
            }"
          >
            <div :style="{ flex: 1 }">
              总分：{{ info(table).totalScore }}
            </div>
            <div :style="{ flex: 1 }">
              题数：{{ info(table).questions }}
            </div>
            <div :style="{ flex: 2 }">
              <ProFormDigit label="及格分" />
            </div>
            <div :style="{ flex: 2 }">
              <ProFormDigit label="考试时间(分钟)" />
            </div>
          </div>
        </template>
      </ProFormDependency>
      <EditableProTable
        ref="editableProTable"
        row-key="id"
        :scroll="{
          x: true,
        }"
        controlled
        :form-item-props="{
          label: '题库编辑',
          rules: [
            {
              validator: async (_, value) => {
                console.log(value.length, 'asdas')
                if (value.length < 1) {
                  throw new Error('请至少添加一个题库');
                }

                if (value.length > 5) {
                  throw new Error('最多可以设置五个题库');
                }
              },
            },
          ],
        }"
        :max-length="10"
        name="table"
        :columns="columns"
        :record-creator-props="{
          record: (index) => {
            return { id: index + 1 };
          },
        }"
        :editable="{
          type: 'multiple',
          editableKeys,
          onChange: (keys) => editableKeys = keys,
        }"
      />
    </ProForm>
  </div>
</template>

<style scoped></style>
