<script setup lang="ts">
import { inject } from 'vue'
import { Menu } from 'lucide-vue-next'

defineProps<{
  title: string
  theme?: string
  headerClass?: string
}>()

const mobileSidebar = inject<{ isOpen: boolean, toggle: () => void } | undefined>('mobileSidebar', undefined)
</script>

<template>
  <header 
    :class="[
      'h-12 shrink-0 flex items-center justify-between px-4 z-10 transition-colors border-b',
      theme ? theme : 'border-border-subtle bg-layer-01/95 backdrop-blur-sm'
    ]"
  >
    <div class="flex items-center gap-3">
      
      <div class="flex flex-col justify-center">
        <h1 :class="['text-sm font-semibold uppercase tracking-wide', theme ? 'text-white' : 'text-text-primary']">{{ title }}</h1>
        <slot name="subtitle"></slot>
      </div>

      <slot name="title-suffix"></slot>
    </div>

    <!-- Center Slot -->
    <div class="flex items-center gap-4 flex-1 justify-center px-2 min-w-0">
      <slot name="center"></slot>
    </div>

    <div class="flex items-center gap-3">
      <slot name="actions"></slot>
      
      <!-- Mobile Sidebar Toggle -->
      <button v-if="mobileSidebar" 
              @click="mobileSidebar.toggle"
              class="lg:hidden p-2 text-text-secondary hover:text-interactive-01 hover:bg-layer-02 transition-colors"
              aria-label="Toggle Sidebar">
          <Menu class="w-5 h-5" />
      </button>
    </div>
  </header>
</template>
