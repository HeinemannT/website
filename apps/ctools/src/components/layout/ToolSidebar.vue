<script setup lang="ts">
defineProps<{
  tabs?: { id: string; label: string }[]
  activeTab?: string
}>()

defineEmits<{
  (e: 'update:activeTab', id: string): void
}>()
</script>

<template>
  <div class="flex flex-col h-full">
     <!-- Tabs -->
     <div v-if="tabs" class="flex border-b border-border-subtle bg-layer-02 h-12 shrink-0">
         <button v-for="tab in tabs" :key="tab.id"
                 @click="$emit('update:activeTab', tab.id)"
                 :class="activeTab === tab.id ? 'border-interactive-01 text-interactive-01 bg-layer-01' : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-layer-01/50'"
                 class="flex-1 h-full flex items-center justify-center text-[10px] font-bold uppercase tracking-wider border-b-2 transition-colors">
             {{ tab.label }}
         </button>
     </div>
     
     <!-- Content -->
     <div class="flex-1 overflow-y-auto relative bg-layer-01">
         <slot></slot>
     </div>
  </div>
</template>
