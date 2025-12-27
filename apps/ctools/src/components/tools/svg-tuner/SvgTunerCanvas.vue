<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Minus, Plus, Maximize, Sun, Moon, Grid, Monitor } from 'lucide-vue-next'

const props = defineProps<{
    svgCode: string
    zoom: number
}>()

const emit = defineEmits<{
    (e: 'update:zoom', val: number): void
}>()

const bgMode = ref<'light' | 'dark' | 'checker' | 'auto'>('auto')
const canvasContainer = ref<HTMLElement | null>(null)

const bgClass = computed(() => {
  if (bgMode.value === 'light') return 'bg-slate-50 bg-grid-pattern'
  if (bgMode.value === 'dark') return 'bg-slate-900 bg-grid-pattern'
  if (bgMode.value === 'checker') return 'bg-[url("https://www.transparenttextures.com/patterns/stardust.png")] bg-slate-200'
  // Auto
  return 'bg-slate-50 dark:bg-slate-900 bg-grid-pattern'
})
// ... (omitting lines for brevity in replace match)


const localZoom = computed({
    get: () => props.zoom,
    set: (val) => emit('update:zoom', val)
})

const updateZoom = (delta: number) => {
    const newVal = Math.max(0.1, Math.min(localZoom.value + delta, 5))
    localZoom.value = parseFloat(newVal.toFixed(2))
}

const fitToScreen = () => {
    if (!canvasContainer.value) return
    const parser = new DOMParser()
    const doc = parser.parseFromString(props.svgCode, "image/svg+xml")
    const svgEl = doc.querySelector('svg')
    if (!svgEl) return

    let w = parseFloat(svgEl.getAttribute('width') || '0')
    let h = parseFloat(svgEl.getAttribute('height') || '0')
    
    if (!w || !h) {
        const vb = svgEl.getAttribute('viewBox')
        if (vb) {
            const parts = vb.split(/[\s,]+/).map(Number)
            if (parts.length === 4) { 
                w = parts[2] as number
                h = parts[3] as number
            }
        }
    }
    // Fallback
    if (!w) w = 300
    if (!h) h = 300

    const containerW = canvasContainer.value.clientWidth
    const containerH = canvasContainer.value.clientHeight
    const scaleX = containerW / w
    const scaleY = containerH / h
    const scale = Math.min(scaleX, scaleY) * 0.7 
    localZoom.value = parseFloat(Math.max(0.1, Math.min(scale, 20)).toFixed(2))
}

const getSvgElement = () => {
    return canvasContainer.value?.querySelector('svg') || null
}

defineExpose({
    fitToScreen,
    getSvgElement
})
</script>

<template>
    <div class="flex-1 relative flex flex-col min-w-0" :class="bgClass">
        
        <!-- Toolbar Overlay -->
        <div class="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
             <!-- Zoom Controls -->
             <div class="bg-white/90 dark:bg-slate-800/90 backdrop-blur shadow-lg ring-1 ring-black/5 dark:ring-white/10 rounded-full px-3 py-1.5 flex items-center gap-2">
                 <button @click="updateZoom(-0.1)" class="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-500 transition-colors"><Minus class="w-4 h-4" /></button>
                 <span class="text-xs font-mono w-10 text-center text-slate-600 dark:text-slate-300 select-none">{{ Math.round(localZoom * 100) }}%</span>
                 <button @click="updateZoom(0.1)" class="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-500 transition-colors"><Plus class="w-4 h-4" /></button>
                 <div class="w-px h-4 bg-slate-300 dark:bg-slate-600 mx-1"></div>
                 <button @click="fitToScreen" class="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-500 transition-colors" title="Fit to Screen"><Maximize class="w-4 h-4" /></button>
             </div>

             <!-- BG Toggles -->
             <div class="bg-white/90 dark:bg-slate-800/90 backdrop-blur shadow-lg ring-1 ring-black/5 dark:ring-white/10 rounded-full p-1 flex items-center gap-1">
                 <button @click="bgMode = 'auto'" :class="bgMode === 'auto' ? 'bg-slate-200 dark:bg-slate-700 text-cora-600 dark:text-cora-400' : 'text-slate-400 hover:text-slate-600'" class="p-1.5 rounded-full transition-colors font-bold text-[10px]" title="System Theme"><Monitor class="w-4 h-4" /></button>
                 <button @click="bgMode = 'light'" :class="bgMode === 'light' ? 'bg-slate-200 dark:bg-slate-700 text-cora-600 dark:text-cora-400' : 'text-slate-400 hover:text-slate-600'" class="p-1.5 rounded-full transition-colors"><Sun class="w-4 h-4" /></button>
                 <button @click="bgMode = 'dark'" :class="bgMode === 'dark' ? 'bg-slate-200 dark:bg-slate-700 text-cora-600 dark:text-cora-400' : 'text-slate-400 hover:text-slate-600'" class="p-1.5 rounded-full transition-colors"><Moon class="w-4 h-4" /></button>
                 <button @click="bgMode = 'checker'" :class="bgMode === 'checker' ? 'bg-slate-200 dark:bg-slate-700 text-cora-600 dark:text-cora-400' : 'text-slate-400 hover:text-slate-600'" class="p-1.5 rounded-full transition-colors"><Grid class="w-4 h-4" /></button>
             </div>
        </div>

        <!-- Canvas -->
        <div ref="canvasContainer" class="flex-1 overflow-auto flex items-center justify-center p-8 cursor-grab active:cursor-grabbing select-none" @wheel.ctrl.prevent="(e) => e.deltaY < 0 ? updateZoom(0.1) : updateZoom(-0.1)">
            <div class="relative transition-transform duration-100 ease-linear origin-center" :style="{ transform: `scale(${localZoom})` }">
                <!-- Helper visual border -->
                 <div class="absolute -inset-px pointer-events-none opacity-75 z-10 border-cora-500 border-dashed" :style="{ borderWidth: `${2/localZoom}px` }"></div>
                 <div v-html="svgCode" class="svg-content block" id="svg-render-target"></div>
            </div>
        </div>
    </div>
</template>

<style scoped>
:deep(svg) {
    display: block;
}
</style>
