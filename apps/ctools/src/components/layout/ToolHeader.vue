<script setup lang="ts">
import { inject } from 'vue'
import { Menu } from 'lucide-vue-next'

defineProps<{
  title: string
  icon?: any
  iconColor?: string
}>()

const mobileSidebar = inject<{ isOpen: boolean, toggle: () => void } | undefined>('mobileSidebar', undefined)
</script>

<template>
  <header class="h-16 shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-between px-4 lg:px-6 z-10 transition-colors">
    <div class="flex items-center gap-3">
      <div v-if="icon" :class="iconColor || 'text-indigo-500'">
        <component :is="icon" class="w-5 h-5" />
      </div>
      
      <div class="flex flex-col justify-center">
        <h1 class="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide">{{ title }}</h1>
        <slot name="subtitle"></slot>
      </div>

      <slot name="title-suffix"></slot>
    </div>

    <!-- Center Slot (Hidden on very small screens if needed, but usually fine) -->
    <div class="flex items-center gap-4 flex-1 justify-center px-2 min-w-0">
      <slot name="center"></slot>
    </div>

    <div class="flex items-center gap-3">
      <slot name="actions"></slot>
      
      <!-- Mobile Sidebar Toggle -->
      <button v-if="mobileSidebar" 
              @click="mobileSidebar.toggle"
              class="lg:hidden p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
              aria-label="Toggle Sidebar">
          <Menu class="w-5 h-5" />
      </button>
    </div>
  </header>
</template>
