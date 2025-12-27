<script setup lang="ts">
import { useRouter } from 'vue-router'
import Squares from '../components/backgrounds/Squares.vue'
import { DASHBOARD_TOOLS } from '../config/tools'

const router = useRouter()
const tools = DASHBOARD_TOOLS

const navigateTo = (path?: string) => {
    if (path) router.push(path)
}
</script>

<template>
    <div class="h-full overflow-y-auto bg-transparent p-10 relative isolate">
        <!-- Background -->
        <Squares 
            :square-size="35"
            :speed="0.02"
            direction="diagonal"
            border-color="#e2e8f0" 
        />

        <!-- Main Content Wrapper -->
        <div class="max-w-7xl relative z-10 pointer-events-none">
            <!-- Main Header (Left Aligned) -->
            <div class="mb-10 pointer-events-auto">
                <h1 class="text-4xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent tracking-tighter inline-block">CTools</h1>
            </div>

            <!-- Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pointer-events-none w-full">
                <div v-for="tool in tools" :key="tool.id" 
                     @click="navigateTo(tool.path)"
                     class="group cursor-pointer bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 pointer-events-auto flex items-start p-6 gap-5 h-36"
                >
                    <!-- Large Icon (No Box) -->
                    <div class="shrink-0 transition-colors duration-300"> 
                         <component :is="tool.icon" class="w-10 h-10" :class="tool.color" /> 
                    </div>

                    <!-- Content -->
                    <div class="flex-1 min-w-0 py-0.5 flex flex-col h-full">
                        <h3 class="font-bold text-lg text-slate-800 dark:text-slate-100 mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors leading-tight break-words">
                            {{ tool.name }}
                        </h3>
                        <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                            {{ tool.description }}
                        </p>
                    </div>

                    <!-- Chevron -->
                    <div class="text-slate-300 dark:text-slate-700 group-hover:text-purple-500 dark:group-hover:text-purple-400 self-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
