<script setup lang="ts">
import { computed, ref } from 'vue'
import { Minus, Plus, Maximize, Sun, Moon, Grid, Monitor } from 'lucide-vue-next'

const props = defineProps<{
    svgCode: string
    zoom: number
    dimensions?: { width: string, height: string }
}>()

const emit = defineEmits<{
    (e: 'update:zoom', val: number): void
}>()

const bgMode = ref<'light' | 'dark' | 'checker' | 'auto'>('auto')
const canvasContainer = ref<HTMLElement | null>(null)

const bgClass = computed(() => {
  // Use explicit tailwind colors + explicit dot pattern classes
  if (bgMode.value === 'light') return 'bg-[#ffffff] text-black bg-pattern-dots-light'
  if (bgMode.value === 'dark') return 'bg-[#161616] text-white bg-pattern-dots-dark'
  if (bgMode.value === 'checker') return 'bg-checkerboard text-black' 
  // Auto: Use the dedicated technical canvas class
  return 'bg-canvas'
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
    let w = 0
    let h = 0

    // Optimization: Use provided dimensions if available to avoid parsing
    if (props.dimensions && props.dimensions.width && props.dimensions.height) {
        w = parseFloat(props.dimensions.width)
        h = parseFloat(props.dimensions.height)
    }

    if ((!w || !h) && props.svgCode) {
        // Fallback or full parse if needed
        const parser = new DOMParser()
        const doc = parser.parseFromString(props.svgCode, "image/svg+xml")
        const svgEl = doc.querySelector('svg')
        if (svgEl) {
             w = parseFloat(svgEl.getAttribute('width') || '0')
             h = parseFloat(svgEl.getAttribute('height') || '0')
             
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
             <div class="bg-layer-01/90 backdrop-blur shadow-none border border-border-subtle rounded-none px-3 py-1.5 flex items-center gap-2">
                 <button @click="updateZoom(-0.1)" class="p-1 hover:bg-layer-02 rounded-none text-text-secondary transition-colors"><Minus class="w-4 h-4" /></button>
                 <span class="text-xs font-mono w-10 text-center text-text-primary select-none">{{ Math.round(localZoom * 100) }}%</span>
                 <button @click="updateZoom(0.1)" class="p-1 hover:bg-layer-02 rounded-none text-text-secondary transition-colors"><Plus class="w-4 h-4" /></button>
                 <div class="w-px h-4 bg-border-strong mx-1"></div>
                 <button @click="fitToScreen" class="p-1 hover:bg-layer-02 rounded-none text-text-secondary transition-colors" title="Fit to Screen"><Maximize class="w-4 h-4" /></button>
             </div>

             <!-- BG Toggles -->
             <div class="bg-layer-01/90 backdrop-blur shadow-none border border-border-subtle rounded-none p-1 flex items-center gap-1">
                 <button @click="bgMode = 'auto'" :class="bgMode === 'auto' ? 'bg-layer-03 text-text-primary' : 'text-text-secondary hover:text-text-primary'" class="p-1.5 rounded-none transition-colors font-bold text-[10px]" title="System Theme"><Monitor class="w-4 h-4" /></button>
                 <button @click="bgMode = 'light'" :class="bgMode === 'light' ? 'bg-layer-03 text-text-primary' : 'text-text-secondary hover:text-text-primary'" class="p-1.5 rounded-none transition-colors"><Sun class="w-4 h-4" /></button>
                 <button @click="bgMode = 'dark'" :class="bgMode === 'dark' ? 'bg-layer-03 text-text-primary' : 'text-text-secondary hover:text-text-primary'" class="p-1.5 rounded-none transition-colors"><Moon class="w-4 h-4" /></button>
                 <button @click="bgMode = 'checker'" :class="bgMode === 'checker' ? 'bg-layer-03 text-text-primary' : 'text-text-secondary hover:text-text-primary'" class="p-1.5 rounded-none transition-colors"><Grid class="w-4 h-4" /></button>
             </div>
        </div>

        <!-- Canvas -->
        <div ref="canvasContainer" class="flex-1 overflow-auto flex items-center justify-center p-8 cursor-grab active:cursor-grabbing select-none" @wheel.ctrl.prevent="(e) => e.deltaY < 0 ? updateZoom(0.1) : updateZoom(-0.1)">
            <div class="relative transition-transform duration-100 ease-linear origin-center" :style="{ transform: `scale(${localZoom})` }">
                <!-- Helper visual border -->
                 <div class="absolute -inset-px pointer-events-none opacity-75 z-10 border-interactive-01 border-dashed" :style="{ borderWidth: `${2/localZoom}px` }"></div>
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
