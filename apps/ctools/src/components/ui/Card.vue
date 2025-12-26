<script setup lang="ts">
interface Props {
  title?: string
  noPadding?: boolean
}

withDefaults(defineProps<Props>(), {
  noPadding: false
})
</script>

<template>
  <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden flex flex-col">
    <div v-if="title" class="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center shrink-0">
      <h3 class="font-semibold text-sm text-slate-700 dark:text-slate-200">{{ title }}</h3>
      <div class="flex items-center gap-2">
        <slot name="actions" />
      </div>
    </div>
    <div :class="[noPadding ? '' : 'p-4', 'flex-1 overflow-hidden relative']">
      <slot />
    </div>
  </div>
</template>
