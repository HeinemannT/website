<script setup lang="ts">
import { 
    Palette, 
    LayoutTemplate, 
    Activity, 
    Table, 
    Image as ImageIcon, 
    Edit3 
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
        path: '/tuner', 
        icon: Edit3, 
        color: 'text-teal-500',
        bg: 'bg-teal-50 dark:bg-teal-900/20',
        border: 'hover:border-teal-300 dark:hover:border-teal-700'
    },
    { 
        id: 'cdraw',
        name: 'Visual IDE', 
        description: 'Local-first Visual IDE for GRC. Diagramming and modeling with smart connectors.',
        path: '/cdraw', 
        icon: Edit3, 
        color: 'text-sky-500',
        bg: 'bg-sky-50 dark:bg-sky-900/20',
        border: 'hover:border-sky-300 dark:hover:border-sky-700'
    }
]

const navigateTo = (path: string) => {
    router.push(path)
}
</script>

<template>
    <div class="h-full overflow-y-auto p-8 bg-slate-50 dark:bg-slate-950">
        <div class="max-w-5xl mx-auto">
            <header class="mb-10">
                <h1 class="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">CTools Suite</h1>
                <p class="text-lg text-slate-500 dark:text-slate-400">Select a tool to get started.</p>
            </header>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="tool in tools" :key="tool.id" 
                    @click="navigateTo(tool.path)"
                    class="group cursor-pointer bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 block"
                    :class="tool.border"
                >
                    <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300" :class="tool.bg">
                        <component :is="tool.icon" class="w-6 h-6" :class="tool.color" />
                    </div>
                    
                    <h3 class="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                        {{ tool.name }}
                    </h3>
                    
                    <p class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                        {{ tool.description }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
