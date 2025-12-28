<script setup lang="ts">
import { ref, watch, toRefs } from 'vue'
import { 
  Zap, Palette as PaletteIcon, Code,
  Type, Crop, HelpCircle, Folder
} from 'lucide-vue-next'
import BaseButton from '../../ui/BaseButton.vue'
import BaseInput from '../../ui/BaseInput.vue'
import { useClipboard } from '../../../composables/useClipboard'
import { useResourceScript } from '../../../composables/useResourceScript'
import { useToast } from '../../../composables/useToast'

const props = defineProps<{
    svgCode: string
    colors: {original: string, val: string}[]
    dimensions: { width: string, height: string }
    optimizationStats: string
    activeTab: 'tune' | 'code'
    paddingVal: number
}>()

const emit = defineEmits<{
    (e: 'update:activeTab', val: 'tune' | 'code'): void
    (e: 'update:svgCode', val: string): void
    (e: 'update:paddingVal', val: number): void
    (e: 'updateColor', original: string, newVal: string): void
    (e: 'updateDimensions'): void
    (e: 'optimizeSVG'): void
    (e: 'autoCrop'): void
    (e: 'applyPadding'): void
    (e: 'fileUploaded'): void
    (e: 'importUrl', url: string): void
}>()

const { copy } = useClipboard()
const { generateScript } = useResourceScript()
const { add: toast } = useToast()

const { svgCode, colors, dimensions, optimizationStats, activeTab, paddingVal } = toRefs(props)

const scriptId = ref('') // Default empty
const generatedScript = ref('Generating script...')
const activeCodeSubTab = ref<'raw' | 'extended'>('raw')
const targetFolder = ref('vFolder')

const updateScriptArea = async () => {
    // script generation logic
    console.log('SvgTuner: updateScriptArea called', { id: scriptId.value })
    generatedScript.value = "// Generating script..."
    try {
        const item = {
            id: scriptId.value,
            name: 'tuned-design',
            mimeType: 'image/svg+xml',
            data: props.svgCode
        }
        console.log('SvgTuner: generating for item', item)
        const script = await generateScript([item], targetFolder.value, `Imported SVG`)
        generatedScript.value = script
    } catch (e: any) {
        generatedScript.value = "// Error generating script: " + e.message
    }
}

// Reactively update script when relevant dependencies change
let debounceTimer: ReturnType<typeof setTimeout>
watch([scriptId, targetFolder, () => props.svgCode], () => {
    if (activeCodeSubTab.value === 'extended') {
         clearTimeout(debounceTimer)
         debounceTimer = setTimeout(() => {
             updateScriptArea()
         }, 300)
    }
})

// Initialize on mount/tab switch
watch(activeCodeSubTab, (val) => {
    if (val === 'extended') updateScriptArea()
})
watch(() => props.activeTab, (val) => {
    if (val === 'code' && activeCodeSubTab.value === 'extended') updateScriptArea()
})

const copyExtendedScript = async () => {
    try {
        const script = await generateScript([{
            id: scriptId.value,
            name: 'tuned-design',
            mimeType: 'image/svg+xml',
            data: props.svgCode
        }], targetFolder.value, `Imported SVG`)
        copy(script, 'Extended Script')
    } catch (e: any) {
        toast('Failed to generate script: ' + e.message, 'error')
    }
}
</script>

<template>
    <div class="h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col z-20 shadow-xl w-96 font-sans">
        
        <!-- Tabs -->
        <div class="flex border-b border-slate-100 dark:border-slate-800">
            <button v-for="tab in ['tune', 'code']" :key="tab"
                @click="$emit('update:activeTab', tab as any)"
                class="flex-1 py-3 text-xs font-medium uppercase tracking-wider transition-colors relative"
                :class="activeTab === tab ? 'text-cora-600 dark:text-cora-400 bg-slate-50 dark:bg-slate-800/50' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'"
            >
                {{ tab }}
                <div v-if="activeTab === tab" class="absolute bottom-0 left-0 right-0 h-0.5 bg-cora-500"></div>
            </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-4 space-y-6">

            <!-- TUNE TAB -->
            <div v-if="activeTab === 'tune'" class="space-y-6">
                
                <!-- Colors -->
                <div>
                     <div class="flex items-center justify-between mb-3 px-1">
                        <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <PaletteIcon class="w-3 h-3" /> Colors ({{ colors.length }})
                        </h3>
                    </div>

                    <div v-if="colors.length === 0" class="text-center py-8 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
                        No editable colors found.
                    </div>

                    <div v-else class="grid grid-cols-8 gap-1.5">
                         <div v-for="(color, idx) in colors" :key="idx" class="group relative aspect-square rounded overflow-hidden ring-1 ring-slate-200 dark:ring-slate-700 cursor-pointer shadow-sm hover:ring-2 hover:ring-cora-500 hover:z-10 transition-all">
                             <div class="absolute inset-0 z-0" :style="{ backgroundColor: color.val }"></div>
                             <input type="color" v-model="color.val" @input="$emit('updateColor', color.original, color.val)" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                             
                             <!-- Tooltip on hover -->
                             <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl font-mono">
                                {{ color.val.toUpperCase() }}
                             </div>
                         </div>
                    </div>
                </div>

                <hr class="border-slate-100 dark:border-slate-800" />

                <!-- Dimensions & Geometry -->
                <div class="space-y-4">
                    <div class="flex items-center justify-between px-1">
                        <h3 class="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <Type class="w-3 h-3" /> Geometry
                        </h3>
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                         <BaseInput label="Width" v-model="dimensions.width" @change="$emit('updateDimensions')" mono placeholder="auto" />
                         <BaseInput label="Height" v-model="dimensions.height" @change="$emit('updateDimensions')" mono placeholder="auto" />
                    </div>

                    <div class="pt-2">
                         <div class="flex justify-between mb-2">
                           <span class="text-xs font-medium text-slate-600 dark:text-slate-400">Padding</span>
                           <span class="text-xs font-mono" :class="paddingVal < 0 ? 'text-pink-500' : 'text-emerald-500'">{{ paddingVal > 0 ? '+' : '' }}{{ paddingVal }}%</span>
                        </div>
                        <input type="range" :value="paddingVal" @input="$emit('update:paddingVal', Number(($event.target as HTMLInputElement).value)); $emit('applyPadding')" min="-50" max="50" step="1" 
                           class="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cora-500" />
                    </div>

                    <BaseButton size="sm" variant="outline" class="w-full" @click="$emit('autoCrop')">
                        <Crop class="w-3.5 h-3.5 mr-2" /> Auto-Crop to Content
                    </BaseButton>
                </div>

                <hr class="border-slate-100 dark:border-slate-800" />
                
                <!-- Optimization (Moved to bottom) -->
                <div class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                    <div class="flex items-center gap-2">
                        <div class="group relative">
                             <HelpCircle class="w-3.5 h-3.5 text-slate-400 cursor-help" />
                             <div class="absolute bottom-full left-0 mb-2 w-48 p-2 bg-slate-800 text-slate-100 text-[10px] rounded shadow-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 px-3 py-2 leading-relaxed">
                                Removes comments, empty tags, and collapses whitespace.
                            </div>
                        </div>
                        <span class="text-xs font-semibold text-slate-700 dark:text-slate-300">Smart Minify</span>
                    </div>
                    <BaseButton size="sm" variant="outline" class="h-7 text-[10px]" @click="$emit('optimizeSVG')">
                        <Zap class="w-3 h-3 mr-1 text-slate-400" /> {{ optimizationStats || 'Run' }}
                    </BaseButton>
                </div>

            </div>

            <!-- CODE TAB -->
            <div v-if="activeTab === 'code'" class="h-full flex flex-col overflow-hidden">
                
                <!-- Sub Tabs -->
                <div class="flex gap-1 mb-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                    <button 
                        @click="activeCodeSubTab = 'raw'"
                        class="flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded transition-colors"
                        :class="activeCodeSubTab === 'raw' ? 'bg-white dark:bg-slate-700 text-cora-600 dark:text-cora-400 shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'"
                    >Raw</button>
                    <button 
                        @click="activeCodeSubTab = 'extended'"
                        class="flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded transition-colors"
                        :class="activeCodeSubTab === 'extended' ? 'bg-white dark:bg-slate-700 text-cora-600 dark:text-cora-400 shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'"
                    >Extended</button>
                </div>

                <!-- Active Sub Tab Content -->
                <div v-if="activeCodeSubTab === 'raw'" class="flex-1 flex flex-col min-h-0 gap-2">
                     <div class="flex items-center justify-between">
                         <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider">Raw SVG (Editable)</h4>
                         <BaseButton size="sm" variant="ghost" class="h-6 text-[10px]" @click="copy(svgCode, 'SVG Code')">Copy</BaseButton>
                     </div>
                     <textarea 
                         :value="svgCode" 
                         @input="$emit('update:svgCode', ($event.target as HTMLTextAreaElement).value)"
                         class="flex-1 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded p-2 text-[10px] font-mono text-slate-600 dark:text-slate-400 focus:outline-none resize-none focus:ring-1 focus:ring-cora-500"
                     ></textarea>
                </div>
 
                <div v-if="activeCodeSubTab === 'extended'" class="flex-1 flex flex-col min-h-0 gap-3">
                     <div class="flex flex-col gap-2 bg-slate-50 dark:bg-slate-950 p-3 rounded border border-slate-100 dark:border-slate-800">
                        <div class="flex items-center gap-2">
                             <BaseInput label="ID" v-model="scriptId" size="sm" class="flex-1" mono />
                             <BaseInput label="Target Folder" v-model="targetFolder" size="sm" class="flex-1">
                                 <template #prefix><Folder class="w-3 h-3 text-slate-400" /></template>
                             </BaseInput>
                        </div>
                        <BaseButton size="sm" variant="outline" class="w-full h-7" @click="copyExtendedScript">
                             <Code class="w-3.5 h-3.5 mr-2" /> Copy Script
                        </BaseButton>
                     </div>
                     
                     <div class="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded p-2 overflow-auto relative group">
                        <textarea 
                            readonly 
                            :value="generatedScript"
                            class="w-full h-full bg-transparent border-none p-0 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 focus:outline-none resize-none"
                        ></textarea>
                     </div>
                </div>
             </div>

        </div>
    </div>
</template>

<style scoped>
/* Custom scrollbar for better density */
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background: transparent; 
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1; 
  border-radius: 2px;
}
.dark ::-webkit-scrollbar-thumb {
  background: #334155; 
}
</style>
