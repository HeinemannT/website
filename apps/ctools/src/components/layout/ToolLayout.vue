<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    sidebarClass?: string,
    sidebarStyle?: Record<string, string>,
    sidebarPosition?: 'left' | 'right'
}>()

const positionLeft = computed(() => props.sidebarPosition === 'left')
</script>

<template>
    <div class="h-full flex flex-col lg:flex-row overflow-hidden bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
        
        <!-- Sidebar (if Left) -->
        <div v-if="positionLeft" 
             class="flex flex-col bg-white dark:bg-slate-800 shadow-2xl z-20 relative border-r border-slate-200 dark:border-slate-800"
             :class="sidebarClass"
             :style="sidebarStyle">
             <slot name="sidebar"></slot>
        </div>

        <!-- Main -->
        <div class="flex-1 flex flex-col relative bg-grid-pattern overflow-hidden h-full">
             <slot name="main"></slot>
        </div>

        <!-- Sidebar (if Right - Default) -->
        <div v-if="!positionLeft"
             class="flex flex-col bg-white dark:bg-slate-800 shadow-2xl z-20 relative border-l border-slate-200 dark:border-slate-800"
             :class="sidebarClass"
             :style="sidebarStyle">
             <slot name="sidebar"></slot>
        </div>

    </div>
</template>
