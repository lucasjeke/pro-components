<script setup lang="ts">
import { SandpackCodeEditor, useActiveCode, useSandpack } from 'sandpack-vue3'
import { watch } from 'vue'

defineOptions({
  name: 'CodeEditorBridge',
})
defineProps<CodeEditorBridgeProps>()

const emit = defineEmits<CodeEditorBridgeEmits>()

interface CodeEditorBridgeEmits {
  (event: 'update:code', code: string): void
}

interface CodeEditorBridgeProps {
  readOnly?: boolean
}

const { code } = useActiveCode()
const { sandpack } = useSandpack()

function resetCode(newCode: string) {
  sandpack.updateCurrentFile(newCode)
}

defineExpose({ resetCode })

watch(code, (val) => {
  if (val !== undefined)
    emit('update:code', val)
})
</script>

<template>
  <SandpackCodeEditor
    :read-only="readOnly"
    :show-line-numbers="false"
    :show-tabs="false"
    class="min-h-45"
  />
</template>
