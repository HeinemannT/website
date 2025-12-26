<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { 
  Upload, ClipboardPaste, Download, Image as ImageIcon, 
  Minus, Plus, RotateCcw, Sun, Moon, Grid, 
  Crop, Zap, Check, Palette as PaletteIcon, PaintBucket
} from 'lucide-vue-next'
import InspectorPanel from '../components/ui/InspectorPanel.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import CodeOutputPanel from '../components/ui/CodeOutputPanel.vue'
import BaseInput from '../components/ui/BaseInput.vue'
import { useToast } from '../composables/useToast'
import { useDownload } from '../composables/useDownload'

// Composables
const { add: toast } = useToast()
const { downloadBlob } = useDownload()

// State
const defaultSVG = `<svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">\n    <rect width="400" height="400" fill="#ffffff" rx="20"/>\n    <circle cx="200" cy="200" r="120" fill="#4f46e5" fill-opacity="0.1"/>\n    <path d="M200 80 L320 300 L80 300 Z" fill="#6366f1" stroke="#4338ca" stroke-width="10" stroke-linejoin="round"/>\n    <circle cx="200" cy="240" r="40" fill="#ffffff"/>\n</svg>`

const svgCode = ref(defaultSVG)
const colors = ref<{original: string, val: string}[]>([])
const activeTab = ref<'tune' | 'palette' | 'code'>('tune')
const bgMode = ref<'light' | 'dark' | 'checker'>('light')
const zoom = ref(0.8)
const optimizationStats = ref('')
const dimensions = ref({ width: '', height: '' })
const paddingVal = ref(0)
const exportName = ref('tuned-design')
const canvasContainer = ref<HTMLElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const baseViewBox = ref<{x: number, y: number, w: number, h: number} | null>(null)

// Computed
const bgClass = computed(() => {
  if (bgMode.value === 'light') return 'bg-slate-50 bg-grid-pattern'
  if (bgMode.value === 'dark') return 'bg-slate-900 bg-grid-pattern'
  return 'bg-[url("https://www.transparenttextures.com/patterns/stardust.png")] bg-slate-200'
})

const svgSize = computed(() => {
  const bytes = new Blob([svgCode.value]).size
  return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(2)} KB`
})

// Logics
const analyzeSVG = () => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(svgCode.value, "image/svg+xml")

    const svgEl = doc.querySelector('svg')
    if (svgEl) {
        dimensions.value.width = svgEl.getAttribute('width') || ''
        dimensions.value.height = svgEl.getAttribute('height') || ''

        const vb = svgEl.getAttribute('viewBox')
        if (vb && !baseViewBox.value) {
            const parts = vb.split(/[\s,]+/).map(Number)
            if (parts.length === 4) {
                 const [x, y, w, h] = parts as [number, number, number, number]
                 baseViewBox.value = { x, y, w, h }
            }
        }
    }

    const foundColors = new Set<string>()
    const walker = document.createTreeWalker(doc, NodeFilter.SHOW_ELEMENT)
    while (walker.nextNode()) {
        const el = walker.currentNode as Element
        ['fill', 'stroke'].forEach(attr => {
            const val = el.getAttribute(attr)
            if (val && val !== 'none' && !val.startsWith('url(')) foundColors.add(val)
        })
        const style = (el as HTMLElement).style
        if (style) {
            if (style.fill && style.fill !== 'none') foundColors.add(style.fill)
            if (style.stroke && style.stroke !== 'none') foundColors.add(style.stroke)
        }
    }
    colors.value = Array.from(foundColors).map(c => ({ original: c, val: c }))
}

const updateColor = (original: string, newVal: string) => {
    let newCode = svgCode.value
    // Use regex with global flag to replace all occurrences
    const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const safeOriginal = escapeRegExp(original);
    
    newCode = newCode.replace(new RegExp(`="${safeOriginal}"`, 'g'), `="${newVal}"`)
    newCode = newCode.replace(new RegExp(`: ${safeOriginal}`, 'g'), `: ${newVal}`)
    newCode = newCode.replace(new RegExp(`:${safeOriginal}`, 'g'), `:${newVal}`)
    
    svgCode.value = newCode
    const cIndex = colors.value.findIndex(c => c.original === original)
    if (cIndex !== -1 && colors.value[cIndex]) {
        colors.value[cIndex]!.original = newVal
    }
}

const injectColor = (color: string) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(svgCode.value, "image/svg+xml")
    const svgEl = doc.querySelector('svg')
    if (svgEl) {
        svgEl.setAttribute('fill', color)
        svgCode.value = new XMLSerializer().serializeToString(doc)
        toast('Applied fill to root SVG', 'success')
    }
}

const fitToScreen = () => {
    if (!canvasContainer.value) return
    const parser = new DOMParser()
    const doc = parser.parseFromString(svgCode.value, "image/svg+xml")
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
    if (!w) w = 300
    if (!h) h = 150

    const containerW = canvasContainer.value.clientWidth
    const containerH = canvasContainer.value.clientHeight
    const scaleX = containerW / w
    const scaleY = containerH / h
    const scale = Math.min(scaleX, scaleY) * 0.8
    zoom.value = parseFloat(Math.max(0.1, Math.min(scale, 20)).toFixed(2))
}

const autoCrop = () => {
    const container = document.getElementById('svg-render-target')
    const svgEl = container ? container.querySelector('svg') : null
    if (!svgEl) return
    try {
        const bbox = svgEl.getBBox()
        const x = Math.floor(bbox.x)
        const y = Math.floor(bbox.y)
        const w = Math.ceil(bbox.width)
        const h = Math.ceil(bbox.height)
        const newVB = `${x} ${y} ${w} ${h}`

        const parser = new DOMParser()
        const doc = parser.parseFromString(svgCode.value, "image/svg+xml")
        const domSvg = doc.querySelector('svg')
        if (domSvg) {
            domSvg.setAttribute('viewBox', newVB)
            domSvg.setAttribute('width', w.toString())
            domSvg.setAttribute('height', h.toString())
            dimensions.value.width = w.toString()
            dimensions.value.height = h.toString()
            svgCode.value = new XMLSerializer().serializeToString(doc)
            baseViewBox.value = { x, y, w, h }
            paddingVal.value = 0
            toast('ViewBox snapped to content', 'success')
            nextTick(() => fitToScreen())
        }
    } catch (e) {
        toast('Could not calculate bounding box. Ensure SVG is rendered.', 'error')
    }
}

const applyPadding = () => {
    if (!baseViewBox.value) return
    const p = paddingVal.value
    const b = baseViewBox.value
    const newX = b.x - p
    const newY = b.y - p
    const newW = b.w + (p * 2)
    const newH = b.h + (p * 2)
    const newVB = `${newX} ${newY} ${newW} ${newH}`

    const parser = new DOMParser()
    const doc = parser.parseFromString(svgCode.value, "image/svg+xml")
    const domSvg = doc.querySelector('svg')
    if (domSvg) {
        domSvg.setAttribute('viewBox', newVB)
        svgCode.value = new XMLSerializer().serializeToString(doc)
    }
}

const safeMinify = () => {
    const originalSize = new Blob([svgCode.value]).size
    const parser = new DOMParser()
    const doc = parser.parseFromString(svgCode.value, "image/svg+xml")
    const clean = (node: Node) => {
        const children = Array.from(node.childNodes)
        for (const child of children) {
            if (child.nodeType === Node.COMMENT_NODE) {
                node.removeChild(child)
            } else if (child.nodeType === Node.TEXT_NODE) {
                if (!child.textContent?.trim()) {
                    node.removeChild(child)
                } else {
                    child.textContent = child.textContent.trim()
                }
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                clean(child)
            }
        }
    }
    const svgRoot = doc.querySelector('svg')
    if (svgRoot) clean(svgRoot)
    let result = new XMLSerializer().serializeToString(doc)
    result = result.replace(/>\s+</g, '><')
    svgCode.value = result
    const newSize = new Blob([svgCode.value]).size
    const saved = ((originalSize - newSize) / 1024).toFixed(2)
    optimizationStats.value = `Saved ${saved} KB`
    toast(`Safely reduced size by ${saved} KB`, 'success')
}

const updateDimensions = () => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(svgCode.value, "image/svg+xml")
    const svgEl = doc.querySelector('svg')
    if (svgEl) {
        if (dimensions.value.width) svgEl.setAttribute('width', dimensions.value.width)
        if (dimensions.value.height) svgEl.setAttribute('height', dimensions.value.height)
        svgCode.value = new XMLSerializer().serializeToString(doc)
    }
}

const handleFileUpload = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
        svgCode.value = evt.target?.result as string
        const fname = file.name.replace(/\.[^/.]+$/, "")
        exportName.value = fname || 'tuned-design'
        activeTab.value = 'tune'
        baseViewBox.value = null
        paddingVal.value = 0
        nextTick(() => {
            analyzeSVG()
            fitToScreen()
        })
    }
    reader.readAsText(file)
}

const downloadSVGFn = () => {
    downloadBlob(svgCode.value, `${exportName.value || 'tuned-design'}.svg`, 'image/svg+xml')
}

const downloadPNGFn = () => {
    const svgBlob = new Blob([svgCode.value], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)
    const img = new Image()
    img.onload = () => {
        const canvas = document.createElement('canvas')
        const w = parseFloat(dimensions.value.width) || 800
        const h = parseFloat(dimensions.value.height) || 800
        canvas.width = w; canvas.height = h
        const ctx = canvas.getContext('2d')
        if (ctx) {
            ctx.drawImage(img, 0, 0, w, h)
            const pngUrl = canvas.toDataURL('image/png')
            const link = document.createElement('a')
            link.href = pngUrl
            link.download = `${exportName.value || 'tuned-design'}.png`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }
        URL.revokeObjectURL(url)
        toast('PNG Downloaded', 'success')
    }
    img.src = url
}

// Lifecycle
onMounted(() => {
    analyzeSVG()
    nextTick(() => fitToScreen())
})

watch(activeTab, () => {
    if (activeTab.value === 'code') analyzeSVG()
})
watch(svgCode, () => {
    // Re-analyze on code change? Maybe too aggressive if typing
})
</script>

<template>
  <div class="flex h-full w-full">
    <!-- Main Workspace -->
    <div class="flex-1 relative overflow-hidden flex flex-col" :class="bgClass">
      
      <!-- Toolbar Overlay -->
        <div class="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
          <div class="bg-white/90 dark:bg-slate-800/90 backdrop-blur border border-slate-200 dark:border-slate-700 shadow-xl rounded-lg px-2 py-1 flex items-center text-slate-500 gap-1">
              <button @click="zoom = Math.max(zoom - 0.1, 0.1)" class="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><Minus class="w-4 h-4" /></button>
              <span class="text-xs font-mono w-12 text-center select-none">{{ Math.round(zoom * 100) }}%</span>
              <button @click="zoom = Math.min(zoom + 0.1, 5)" class="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"><Plus class="w-4 h-4" /></button>
              <div class="w-px h-3 bg-slate-300 dark:bg-slate-600 mx-1"></div>
              <button @click="fitToScreen" class="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded" title="Reset View"><RotateCcw class="w-4 h-4" /></button>
          </div>
          
          <div class="bg-white/90 dark:bg-slate-800/90 backdrop-blur border border-slate-200 dark:border-slate-700 shadow-xl rounded-lg p-1 flex items-center gap-1">
              <button @click="bgMode = 'light'" :class="bgMode === 'light' ? 'bg-slate-200 dark:bg-slate-700 text-cora-500' : 'text-slate-400'" class="p-1.5 rounded"><Sun class="w-4 h-4" /></button>
              <button @click="bgMode = 'dark'" :class="bgMode === 'dark' ? 'bg-slate-200 dark:bg-slate-700 text-cora-500' : 'text-slate-400'" class="p-1.5 rounded"><Moon class="w-4 h-4" /></button>
              <button @click="bgMode = 'checker'" :class="bgMode === 'checker' ? 'bg-slate-200 dark:bg-slate-700 text-cora-500' : 'text-slate-400'" class="p-1.5 rounded"><Grid class="w-4 h-4" /></button>
          </div>
        </div>

      <!-- Canvas Area -->
        <div ref="canvasContainer" class="flex-1 flex items-center justify-center overflow-auto p-12 relative group/canvas" @wheel.ctrl.prevent="(e: WheelEvent) => e.deltaY < 0 ? zoom = Math.min(zoom + 0.1, 5) : zoom = Math.max(zoom - 0.1, 0.1)">
          <!-- SVG Logic Wrapper -->
          <div class="relative shadow-2xl transition-transform duration-100 ease-out origin-center" :style="{ transform: `scale(${zoom})` }">
             <div v-html="svgCode" class="block bg-transparent" id="svg-render-target"></div>
          </div>
        </div>
    </div>

    <!-- Inspector -->
    <InspectorPanel title="SVG Controls" width="w-80">
        <template #header-actions>
           <span class="text-[10px] text-slate-400 font-mono">{{ svgSize }}</span>
        </template>

        <!-- Actions -->
        <div class="flex flex-col gap-2">
           <div class="flex gap-2">
             <BaseButton size="sm" variant="outline" class="w-full" @click="fileInput?.click()">
               <input type="file" ref="fileInput" @change="handleFileUpload" accept=".svg" class="hidden">
               <Upload class="w-3 h-3 mr-2" /> Import
             </BaseButton>
             <BaseButton size="sm" variant="outline" class="w-full" @click="activeTab = 'code'">
               <ClipboardPaste class="w-3 h-3 mr-2" /> Code
             </BaseButton>
           </div>
           
           <div class="grid grid-cols-[1fr,auto] gap-2">
              <BaseInput v-model="exportName" placeholder="Filename" mono />
              <div class="flex items-center text-xs text-slate-400 font-mono">.svg</div>
           </div>

           <div class="flex gap-2">
              <BaseButton size="sm" class="w-full" @click="downloadSVGFn">
                <Download class="w-3 h-3 mr-2" /> SVG
              </BaseButton>
              <BaseButton size="sm" variant="ghost" class="w-full bg-pink-100 text-pink-700 hover:bg-pink-200 dark:bg-pink-500/10 dark:text-pink-400 dark:hover:bg-pink-500/20" @click="downloadPNGFn">
                <ImageIcon class="w-3 h-3 mr-2" /> PNG
              </BaseButton>
           </div>
        </div>
        
        <hr class="border-slate-100 dark:border-slate-800 my-2" />

        <!-- Tab Nav -->
        <div class="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg mb-4">
           <button v-for="tab in ['tune', 'palette', 'code']" :key="tab"
             @click="activeTab = tab as any"
             class="flex-1 py-1.5 text-xs font-medium rounded capitalize transition-all"
             :class="activeTab === tab ? 'bg-white dark:bg-slate-700 shadow text-cora-600 dark:text-cora-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'"
           >{{ tab }}</button>
        </div>

        <!-- Tab: Tune -->
        <div v-if="activeTab === 'tune'" class="space-y-6">
            <div>
               <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Geometry</h4>
               <BaseButton size="sm" variant="outline" class="w-full justify-start" @click="autoCrop">
                  <Crop class="w-3.5 h-3.5 mr-2 text-indigo-500" /> Auto-Crop to Content
               </BaseButton>
            </div>

            <div>
               <div class="flex justify-between mb-2">
                  <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">Padding</span>
                  <span class="text-xs font-mono" :class="paddingVal < 0 ? 'text-pink-500' : 'text-emerald-500'">{{ paddingVal > 0 ? '+' : '' }}{{ paddingVal }}px</span>
               </div>
               <input type="range" v-model.number="paddingVal" min="-100" max="100" step="1" @input="applyPadding"
                 class="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cora-500" />
            </div>

            <div>
               <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Dimensions</h4>
               <div class="grid grid-cols-2 gap-2">
                  <BaseInput label="Width" v-model="dimensions.width" @change="updateDimensions" mono />
                  <BaseInput label="Height" v-model="dimensions.height" @change="updateDimensions" mono />
               </div>
            </div>

            <div class="bg-slate-50/50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
               <div class="flex items-center justify-between mb-2">
                 <span class="text-sm font-medium">Smart Minify</span>
                 <Zap class="w-4 h-4 text-amber-500" />
               </div>
               <BaseButton size="sm" variant="ghost" class="w-full text-xs" @click="safeMinify">Running Optimizer</BaseButton>
               <div v-if="optimizationStats" class="text-[10px] text-emerald-500 mt-2 flex items-center">
                  <Check class="w-3 h-3 mr-1" /> {{ optimizationStats }}
               </div>
            </div>
        </div>

        <!-- Tab: Palette -->
        <div v-if="activeTab === 'palette'" class="space-y-3">
             <div v-if="colors.length === 0" class="text-center py-8 text-slate-500">
                <PaletteIcon class="w-8 h-8 mx-auto mb-2 opacity-20" />
                <p class="text-xs">No explicit colors found.</p>
                <div class="mt-4 relative inline-block">
                   <input type="color" @input="(e: any) => injectColor(e.target.value)" class="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                   <BaseButton size="sm">
                      <PaintBucket class="w-3 h-3 mr-2" /> Colorize
                   </BaseButton>
                </div>
             </div>

             <div v-for="(color, index) in colors" :key="index" class="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-2 rounded border border-slate-100 dark:border-slate-800">
                <div class="relative w-6 h-6 shrink-0 rounded overflow-hidden border border-slate-200 dark:border-slate-700">
                  <input type="color" v-model="color.val" @input="updateColor(color.original, color.val)" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" :style="{ backgroundColor: color.val }" />
                  <div class="w-full h-full" :style="{ backgroundColor: color.val }"></div>
                </div>
                <input type="text" v-model="color.val" @change="updateColor(color.original, color.val)" class="flex-1 bg-transparent text-xs font-mono focus:outline-none uppercase text-slate-700 dark:text-slate-300" />
                <span class="text-[10px] text-slate-400 font-mono w-16 truncate text-right">{{ color.original }}</span>
             </div>
        </div>

        <!-- Tab: Code -->
        <div v-if="activeTab === 'code'" class="flex-1 flex flex-col min-h-0 -mx-4 -mb-4 border-t border-slate-200 dark:border-slate-800">
             <CodeOutputPanel title="SVG Code" :code="svgCode" />
        </div>

    </InspectorPanel>
  </div>
</template>

<style scoped>
.accent-cora-500 {
  accent-color: #6366f1;
}
</style>
