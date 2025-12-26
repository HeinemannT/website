<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: string | number
  label?: string
  placeholder?: string
  type?: string
  disabled?: boolean
  mono?: boolean
  icon?: any
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  disabled: false,
  mono: false
})

const emit = defineEmits(['update:modelValue'])

const inputClasses = computed(() => {
  return [
    'w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm transition-all text-slate-900 dark:text-slate-100 placeholder-slate-400',
    'focus:outline-none focus:ring-2 focus:ring-cora-500/20 focus:border-cora-500',
    'disabled:opacity-50 disabled:pointer-events-none',
    props.mono ? 'font-mono text-xs' : 'font-sans',
    props.icon ? 'pl-9' : ''
  ].join(' ')
})
</script>

<template>
  <div class="space-y-1">
    <label v-if="label" class="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
      {{ label }}
    </label>
    <div class="relative">
      <component 
        v-if="icon" 
        :is="icon" 
        class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" 
      />
      <input
        :type="type"
        :value="modelValue"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="inputClasses"
      />
    </div>
  </div>
</template>
