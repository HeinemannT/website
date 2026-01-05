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
  <div class="bg-layer-01 border border-border-subtle flex flex-col overflow-hidden">
    <div v-if="title" class="px-4 py-2 border-b border-border-subtle bg-layer-02 flex justify-between items-center shrink-0 min-h-[48px]">
      <h3 class="font-semibold text-sm text-text-primary tracking-wide">{{ title }}</h3>
      <div class="flex items-center gap-2">
        <slot name="actions" />
      </div>
    </div>
    <div :class="[noPadding ? '' : 'p-4', 'flex-1 overflow-hidden relative']">
      <slot />
    </div>
  </div>
</template>
