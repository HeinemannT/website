<script setup lang="ts">
import Squares from '../components/backgrounds/Squares.vue'
import { DASHBOARD_TOOLS } from '../config/tools'

const tools = DASHBOARD_TOOLS
</script>

<template>
    <div class="h-full overflow-y-auto bg-background p-10 relative isolate">
        <!-- Background -->
        <Squares 
            :square-size="32"
            :speed="0.02"
            direction="diagonal"
            border-color="var(--border-subtle)" 
        />

        <!-- Main Content Wrapper -->
        <div class="max-w-7xl relative z-10 pointer-events-none">

            <!-- Welcome Header -->
            <div class="mb-12 pointer-events-none select-none">
                <h1 class="text-6xl font-sans font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500 tracking-tight mb-2 inline-block">CTools</h1>
                <p class="text-xl text-text-secondary font-normal tracking-wide">
                    Configuration productivity suite
                </p>
            </div>


            <!-- Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pointer-events-none w-full">
                <router-link v-for="tool in tools" :key="tool.id" 
                     :to="tool.path || '/'"
                     class="group cursor-pointer bg-layer-01 hover:bg-layer-02 transition-all duration-200 pointer-events-auto flex items-start p-5 gap-4 h-40 relative focus:outline-none focus:ring-2 focus:ring-focus shadow-sm hover:shadow-md hover:-translate-y-0.5"
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
</template>
