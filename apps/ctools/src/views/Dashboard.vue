<script setup lang="ts">
import { 
    Palette, 
    LayoutTemplate, 
    Activity, 
    Table, 
    Image as ImageIcon, 
    Wand2,
    PenTool
} from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()

const tools = [
    { 
        id: 'colorset',
        name: 'Colorset Builder', 
        description: 'Create and manage color palettes, generate variations, and export as Corporater scripts.',
        path: '/colorset', 
        icon: Palette, 
        color: 'text-pink-500',
        bg: 'bg-pink-50 dark:bg-pink-900/20',
        border: 'hover:border-pink-300 dark:hover:border-pink-700'
    },
    { 
        id: 'layout',
        name: 'Layout Builder', 
        description: 'Design complex layouts with tab sets, rows, and columns. Visual editor with script export.',
        path: '/layout', 
        icon: LayoutTemplate, 
        color: 'text-blue-500',
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'hover:border-blue-300 dark:hover:border-blue-700'
    },
    { 
        id: 'process',
        name: 'Process Tool', 
        description: 'BPMN modeling tool. Create process diagrams with Corporater-specific extensions.',
        path: '/process', 
        icon: Activity, 
        color: 'text-emerald-500',
        bg: 'bg-emerald-50 dark:bg-emerald-900/20',
        border: 'hover:border-emerald-300 dark:hover:border-emerald-700'
    },
    { 
        id: 'table',
        name: 'Table Builder', 
        description: 'Configure Extended Tables with headers, properties, and formatting options.',
        path: '/table', 
        icon: Table, 
        color: 'text-orange-500',
        bg: 'bg-orange-50 dark:bg-orange-900/20',
        border: 'hover:border-orange-300 dark:hover:border-orange-700'
    },
    { 
        id: 'image',
        name: 'Image Upload', 
        description: 'Convert images to Gzip+Base64 scripts for embedding in Corporater. Supports drag & drop.',
        path: '/image', 
        icon: ImageIcon, 
        color: 'text-violet-500',
        bg: 'bg-violet-50 dark:bg-violet-900/20',
        border: 'hover:border-violet-300 dark:hover:border-violet-700'
    },
    { 
        id: 'tuner',
        name: 'SVG Tuner', 
        description: 'Clean, resize, and optimize SVG files. Fix colors and backgrounds for dashboard usage.',
        icon: Wand2, 
        color: 'text-teal-500',
        bg: 'bg-teal-50 dark:bg-teal-900/20',
        border: 'hover:border-teal-300 dark:hover:border-teal-700'
    },
    { 
        id: 'cdraw',
        name: 'cDraw', 
        description: 'Local-first Diagramming and Modelling tool. Create GRC models with smart connectors.',
        path: '/cdraw', 
        icon: PenTool, 
        color: 'text-sky-500',
        bg: 'bg-sky-50 dark:bg-sky-900/20',
        border: 'hover:border-sky-300 dark:hover:border-sky-700'
    }
]

const navigateTo = (path?: string) => {
    if (path) router.push(path)
}
</script>

<template>
    <div class="h-full overflow-y-auto bg-slate-50 dark:bg-slate-950 flex flex-col items-center py-20 px-8">
        
        <!-- Hero Section -->
        <div class="max-w-6xl w-full mb-16 text-center space-y-4">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest mb-4">
                <span class="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                Corporater Tools Suite
            </div>
            <h1 class="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                Empower your <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Workflow</span>
            </h1>
            <p class="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                A collection of specialized utilities designed to accelerate Corporater solution delivery.
                Generate scripts, clean assets, and build layouts with precision.
            </p>
        </div>

        <!-- Grid -->
        <div class="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div v-for="tool in tools" :key="tool.id" 
                 @click="navigateTo(tool.path)"
                 class="group relative cursor-pointer bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
                <!-- Hover Gradient -->
                <div class="absolute inset-0 bg-gradient-to-br from-white via-white to-indigo-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div class="relative z-10 flex flex-col h-full">
                    <!-- Icon Box -->
                    <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-105 shadow-sm border border-slate-100 dark:border-slate-700/50 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
                        <component :is="tool.icon" class="w-7 h-7" :class="tool.color" />
                    </div>
                    
                    <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {{ tool.name }}
                    </h3>
                    
                    <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6 flex-grow">
                        {{ tool.description }}
                    </p>

                    <div class="flex items-center text-xs font-bold text-slate-400 group-hover:text-indigo-500 transition-colors uppercase tracking-wider">
                        Open Tool <span class="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="mt-20 text-center">
            <p class="text-sm text-slate-400 font-medium">© 2024 Corporater Tools. Built for speed.</p>
        </div>
    </div>
</template>
