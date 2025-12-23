<script setup lang="ts">
interface Props {
  title?: string
  width?: string
}

withDefaults(defineProps<Props>(), {
  width: 'w-72'
})
</script>

<template>
  <div 
    class="bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col shadow-xl z-20 shrink-0 h-full"
    :class="width"
  >
    <div v-if="title" class="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center shrink-0">
      <h3 class="font-bold text-xs uppercase tracking-wider text-slate-500">{{ title }}</h3>
      <slot name="header-actions" />
    </div>
    
    <div class="flex-1 overflow-y-auto p-4 space-y-4">
      <slot />
    </div>
  </div>
</template>
