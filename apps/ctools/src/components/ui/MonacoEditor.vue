import { shallowRef } from 'vue'
import { VueMonacoEditor } from '@guolao/vue-monaco-editor'

const props = withDefaults(defineProps<{
    modelValue: string
    language?: string
    readOnly?: boolean
    theme?: string
}>(), {
    language: 'json',
    readOnly: false,
    theme: 'vs-dark'
})

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
}>()

const editorRef = shallowRef()
const handleMount = (editor: any) => {
    editorRef.value = editor
}

const handleChange = (val: string | undefined) => {
    emit('update:modelValue', val || '')
}

const MONACO_OPTIONS = {
    minimap: { enabled: false },
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 12,
    lineNumbers: 'on',
    roundedSelection: false,
    scrollBeyondLastLine: false,
    readOnly: props.readOnly,
    automaticLayout: true,
    padding: { top: 16, bottom: 16 }
}
</script>

<template>
    <div class="w-full h-full overflow-hidden border border-border-strong bg-[#1e1e1e]"> <!-- vs-dark background match -->
        <VueMonacoEditor
            :value="modelValue"
            :language="language"
            :theme="theme"
            :options="{ ...MONACO_OPTIONS, readOnly }"
            @mount="handleMount"
            @change="handleChange"
            class="h-full w-full"
        />
    </div>
</template>
