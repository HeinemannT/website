<script setup lang="ts">
import Squares from '@components/backgrounds/Squares.vue'
import { DASHBOARD_TOOLS } from '@config/tools'

const categories = [
    'Configuration Accelerators', 
    'System Builders', 
    'Various'
] as const

const toolsByCategory = categories.map(cat => ({
    name: cat,
    tools: DASHBOARD_TOOLS.filter(t => t.category === cat)
}))
</script>

<template>
    <div class="h-screen w-full bg-background relative isolate flex flex-col overflow-hidden">
        <!-- Background -->
        <Squares 
            class="absolute inset-0"
        />

        <!-- Main Content -->
        <div class="flex-1 w-full max-w-[1920px] mx-auto p-8 lg:p-12 flex flex-col z-10">
            
            <!-- Header -->
            <div class="shrink-0 mb-8 select-none">
                <h1 class="text-3xl lg:text-4xl font-sans font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500 tracking-tight inline-block">CTools</h1>
            </div>

            <!-- Responsive Columns Layout -->
            <div class="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 xl:gap-20">
                <div v-for="group in toolsByCategory" :key="group.name" class="flex flex-col min-h-0">
                    
                    <!-- Category Header -->
                    <h2 class="text-xs font-bold text-text-primary/70 uppercase tracking-[0.2em] mb-4 lg:mb-6 shrink-0">
                        {{ group.name }}
                    </h2>

                    <!-- Tools Grid (Vertical Stack inside Column) -->
                    <div class="flex-1 flex flex-col gap-4 overflow-y-auto px-2 py-2">
                        <router-link v-for="tool in group.tools" :key="tool.id" 
                             :to="tool.path || '/'"
                             class="group cursor-pointer bg-layer-01 hover:bg-layer-02 transition-all duration-200 pointer-events-auto flex items-start p-5 gap-4 h-40 relative focus:outline-none focus:ring-2 focus:ring-focus shadow-sm hover:shadow-md hover:-translate-y-0.5 border border-transparent"
                             :class="tool.borderClass.replace('hover:border-', 'hover:shadow-')"
                        >
                            <!-- Icon -->
                            <div class="shrink-0" :class="tool.color"> 
                                 <component :is="tool.icon" class="w-6 h-6" /> 
                            </div>

                            <!-- Content -->
                            <div class="flex-1 min-w-0 flex flex-col h-full">
                                <h3 class="font-semibold text-lg text-text-primary mb-2 leading-tight">
                                    {{ tool.name }}
                                </h3>
                                <p class="text-sm text-text-secondary leading-relaxed line-clamp-3">
                                    {{ tool.description }}
                                </p>
                                
                                <!-- Auto-generated generic arrow for Carbon feel -->
                                <div class="mt-auto self-end opacity-0 group-hover:opacity-100 transition-opacity" :class="tool.color">
                                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" fill="currentColor"><path d="M22 16L12 26 10.6 24.6 19.2 16 10.6 7.4 12 6z"/></svg>
                                </div>
                            </div>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
