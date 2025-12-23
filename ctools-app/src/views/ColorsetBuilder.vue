<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { Plus, Trash2, Copy, Palette, Wand2, ArrowRight, ExternalLink, FileCode } from 'lucide-vue-next'
import {
    hexToHsv, hsvToHex, hexToHsl, hslToHex, interpolateColors, hexToRgb, rgbToHex
} from '../utils/colors'
import BaseButton from '../components/ui/BaseButton.vue'
import BaseInput from '../components/ui/BaseInput.vue'
import { useToast } from '../composables/useToast'
import { useClipboard } from '../composables/useClipboard'

const { add: toast } = useToast()
const { copy } = useClipboard()

// --- Types ---
interface ColorStart {
    id: string
    name: string
    hex: string
}

interface GeneratorOutput {
    name: string
    hex: string
}

// --- State ---
const rootParentId = ref('dashboards_colors_folder')
const setName = ref('Status Colors')
const setId = ref('StatusColors')

const palette = ref<ColorStart[]>([
    { id: 'color_ef4444', name: '#EF4444', hex: '#EF4444' },
    { id: 'color_eab308', name: '#EAB308', hex: '#EAB308' },
    { id: 'color_22c55e', name: '#22C55E', hex: '#22C55E' }
])

const activeTab = ref<'studio' | 'generate' | 'import' | 'script'>('studio')
const selectedIndex = ref(-1)

// Editor State
const currentHex = ref('#EF4444')
const currentHue = ref(0)
const currentSat = ref(100)
const currentVal = ref(100)

const currentRgb = ref({ r: 239, g: 68, b: 68 })

// Canvas Refs
const matrixCanvasFn = ref<HTMLCanvasElement | null>(null)
const matrixContainer = ref<HTMLDivElement | null>(null)
const hueContainer = ref<HTMLDivElement | null>(null)
const isMatrixDragging = ref(false)
const isHueDragging = ref(false)

// Generator State
const genStrategy = ref('scale')
const genColors = ref<GeneratorOutput[]>([])
const interStart = ref('#EF4444')
const interEnd = ref('#3B82F6')
const interSteps = ref(5)

// --- Watchers & Sync ---
watch(selectedIndex, (newIdx) => {
    if (newIdx !== -1) {
        const col = palette.value[newIdx]
        if (col) {
            setColorState(col.hex)
            generatePreview()
        }
    }
})

const setColorState = (hex: string) => {
    currentHex.value = hex
    const hsv = hexToHsv(hex)
    currentHue.value = hsv.h
    currentSat.value = hsv.s
    currentVal.value = hsv.v
    const rgb = hexToRgb(hex)
    if (rgb) currentRgb.value = rgb
}

const updateColorFromHex = (val: string) => {
    if (val.length === 7) {
        setColorState(val)
        updateModel()
    }
}

const updateColorFromHsv = () => {
    const hex = hsvToHex(currentHue.value, currentSat.value, currentVal.value)
    currentHex.value = hex
    const rgb = hexToRgb(hex)
    if (rgb) currentRgb.value = rgb
    updateModel()
}

const updateColorFromRgb = () => {
    const hex = rgbToHex(currentRgb.value.r, currentRgb.value.g, currentRgb.value.b)
    currentHex.value = hex
    const hsv = hexToHsv(hex)
    currentHue.value = hsv.h
    currentSat.value = hsv.s
    currentVal.value = hsv.v
    updateModel()
}

// --- Canvas Logic ---
const drawMatrix = () => {
    if (!matrixCanvasFn.value || !matrixContainer.value) return
    const canvas = matrixCanvasFn.value
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return
    
    // Resize to container
    const rect = matrixContainer.value.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return

    canvas.width = rect.width
    canvas.height = rect.height

    // Hue Layer
    ctx.fillStyle = `hsl(${currentHue.value}, 100%, 50%)`
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // White Gradient (Horizontal)
    const grWhite = ctx.createLinearGradient(0, 0, canvas.width, 0)
    grWhite.addColorStop(0, 'white')
    grWhite.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = grWhite
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Black Gradient (Vertical)
    const grBlack = ctx.createLinearGradient(0, 0, 0, canvas.height)
    grBlack.addColorStop(0, 'rgba(0,0,0,0)')
    grBlack.addColorStop(1, 'black')
    ctx.fillStyle = grBlack
    ctx.fillRect(0, 0, canvas.width, canvas.height)
}

const updateMatrixFromMouse = (e: MouseEvent) => {
    if (!matrixContainer.value) return
    const rect = matrixContainer.value.getBoundingClientRect()
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height))
    
    currentSat.value = (x / rect.width) * 100
    currentVal.value = 100 - ((y / rect.height) * 100)
    updateColorFromHsv()
}

const updateHueFromMouse = (e: MouseEvent) => {
    if (!hueContainer.value) return
    const rect = hueContainer.value.getBoundingClientRect()
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height))
    currentHue.value = (y / rect.height) * 360
    updateColorFromHsv() // Triggers drawMatrix via watcher or direct
}

// Lifecycle Hooks for Canvas
onMounted(() => {
    window.addEventListener('mousemove', (e) => {
        if (isMatrixDragging.value) updateMatrixFromMouse(e)
        if (isHueDragging.value) updateHueFromMouse(e)
    })
    window.addEventListener('mouseup', () => {
        isMatrixDragging.value = false
        isHueDragging.value = false
    })
})

// Update canvas when color changes
watch([currentHue, currentSat, currentVal], () => {
    requestAnimationFrame(drawMatrix)
})

watch(activeTab, () => {
   if (activeTab.value === 'studio') {
       nextTick(() => {
           setTimeout(drawMatrix, 50)
       })
   }
})

const updateModel = () => {
    if (selectedIndex.value === -1) return
    const col = palette.value[selectedIndex.value]
    if (!col) return
    
    // Auto-rename if name looks like a previous hex
    if (col.name.startsWith('#') || col.name === col.hex) {
        col.name = currentHex.value
    }
    
    // Auto-update ID if it matches pattern
    const oldHexId = col.hex.replace('#', '').toLowerCase()
    if (col.id === `color_${oldHexId}`) {
        col.id = `color_${currentHex.value.replace('#', '').toLowerCase()}`
    }

    col.hex = currentHex.value
    generatePreview()
}

const addColor = () => {
    const newHex = '#64748B'
    palette.value.push({
        id: 'color_' + newHex.replace('#', '').toLowerCase(),
        name: 'New Color',
        hex: newHex
    })
    selectedIndex.value = palette.value.length - 1
    activeTab.value = 'studio'
}

const deleteColor = (idx: number) => {
    palette.value.splice(idx, 1)
    if (selectedIndex.value === idx) selectedIndex.value = -1
    else if (selectedIndex.value > idx) selectedIndex.value--
}

// --- Generator ---
const generatePreview = () => {
    if (selectedIndex.value === -1 && genStrategy.value !== 'interpolate') {
        genColors.value = []
        return
    }

    const seedHex = selectedIndex.value !== -1 && palette.value[selectedIndex.value] ? palette.value[selectedIndex.value]!.hex : '#000000'
    genColors.value = []

    if (genStrategy.value === 'interpolate') {
        const colors = interpolateColors(interStart.value, interEnd.value, interSteps.value)
        colors.forEach((hex, i) => genColors.value.push({ name: `Step ${i + 1}`, hex }))
    } else {
        const { h, s } = hexToHsl(seedHex)
        
        if (genStrategy.value === 'scale') {
             [95, 85, 75, 65, 55, 45, 35, 25, 15].forEach((light, i) => {
                genColors.value.push({ name: `Weight ${(i + 1) * 100}`, hex: hslToHex(h, s, light) })
            })
        } else if (genStrategy.value === 'pastel') {
            for (let i = 0; i < 6; i++) {
                genColors.value.push({ name: `Pastel ${i + 1}`, hex: hslToHex(h, Math.max(s - 30, 10), 88 - (i * 4)) })
            }
        } else if (genStrategy.value === 'shades') {
             for (let i = 0; i < 6; i++) {
                genColors.value.push({ name: `Shade ${i + 1}`, hex: hslToHex(h, s, 35 - (i * 6)) })
            }
        }
    }
}

const commitGenerated = () => {
    genColors.value.forEach(g => {
        palette.value.push({
            id: 'color_' + g.hex.replace('#', '').toLowerCase(),
            name: g.name,
            hex: g.hex
        })
    })
    toast(`Added ${genColors.value.length} generated colors`, 'success')
    activeTab.value = 'studio'
}

// --- Script Generation ---
const scriptOutput = computed(() => {
    const parent = rootParentId.value || 't'
    let script = `// Set: ${setName.value}\n`
    script += `var targetFolder = ${parent}.create(Folder, id:='${setId.value}', name:='${setName.value}');\n\n`
    
    palette.value.forEach(col => {
        script += `targetFolder.create(Color, id:='${col.id}', name:='${col.name}', color:='${col.hex}');\n`
    })
    return script
})

const copyScript = () => {
    copy(scriptOutput.value, 'Extended Script')
}

// --- Import ---
const importContent = ref('')
const processPaste = () => {
    const lines = importContent.value.split('\n')
    let count = 0
    lines.forEach(line => {
        const match = line.match(/#[a-fA-F0-9]{6}/)
        if (match) {
            const hex = match[0].toUpperCase()
            palette.value.push({
                id: 'color_' + hex.replace('#', '').toLowerCase(),
                name: hex,
                hex
            })
            count++
        }
    })
    toast(`Imported ${count} colors`, 'info')
    importContent.value = ''
    activeTab.value = 'studio'
}

</script>

<template>
    <div class="h-full flex flex-col lg:flex-row overflow-hidden bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        
        <!-- Left: Palette Grid -->
        <div class="lg:w-[55%] flex flex-col border-r border-slate-200 dark:border-slate-800 relative bg-grid-pattern">
            
            <!-- Header Actions -->
            <div class="p-6 bg-white/90 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-10 sticky top-0">
                <div class="flex items-start justify-between gap-6">
                    <div class="flex-1 space-y-3">
                         <input v-model="setName" class="text-3xl font-extrabold bg-transparent border-none outline-none placeholder-slate-400 w-full" placeholder="Palette Name" />
                         <div class="flex items-center gap-2">
                             <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID</span>
                             <input v-model="setId" class="text-sm font-mono text-purple-600 dark:text-purple-400 bg-transparent border-none outline-none" />
                         </div>
                    </div>
                    <button @click="addColor" class="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-full font-bold text-xs shadow-lg hover:scale-105 transition-transform">
                        <Plus class="w-4 h-4" /> New Color
                    </button>
                </div>
            </div>

            <!-- Grid -->
            <div class="flex-1 overflow-y-auto p-6">
                <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    <div v-for="(col, idx) in palette" :key="idx" 
                         @click="selectedIndex = idx"
                         :class="{'ring-2 ring-indigo-500 shadow-xl scale-[1.02]': selectedIndex === idx, 'hover:scale-[1.01]': selectedIndex !== idx}"
                         class="bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200 dark:border-slate-700 cursor-pointer transition-all duration-200 group relative">
                        
                        <div :style="{ backgroundColor: col.hex }" class="h-20 rounded-lg shadow-inner mb-3 relative overflow-hidden">
                             <button @click.stop="deleteColor(idx)" class="absolute top-1 right-1 bg-black/50 text-white p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-500 transition-all"><Trash2 class="w-3 h-3" /></button>
                        </div>
                        
                        <input v-model="col.name" @click.stop class="w-full bg-transparent text-xs font-bold mb-1 border-none p-0 focus:ring-0" />
                        <span class="block text-[10px] font-mono text-slate-400 uppercase">{{ col.hex }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Right: Studio -->
        <div class="lg:w-[45%] flex flex-col bg-white dark:bg-slate-800 shadow-2xl relative z-20">
            <!-- Tabs -->
            <div class="flex border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                <button v-for="tab in ['studio', 'generate', 'import', 'script']" :key="tab"
                        @click="activeTab = tab as any"
                        :class="activeTab === tab ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-400 hover:text-slate-600'"
                        class="flex-1 py-3 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-colors">
                    {{ tab }}
                </button>
            </div>

            <div class="flex-1 overflow-y-auto p-6 relative">
                
                <!-- STUDIO -->
                <div v-if="activeTab === 'studio'" class="h-full flex flex-col">
                    <div v-if="selectedIndex === -1" class="flex-1 flex flex-col items-center justify-center text-slate-400">
                        <Palette class="w-12 h-12 mb-4 opacity-50" />
                        <p class="text-xs uppercase font-bold tracking-widest">Select a color to edit</p>
                    </div>
                    
                    <div v-else class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <!-- Photoshop Style Picker -->
                        <div class="flex gap-4 h-64 mb-6 select-none">
                            <!-- Sat/Val Matrix -->
                            <div class="flex-1 relative rounded-lg border border-slate-300 dark:border-slate-600 overflow-hidden cursor-crosshair shadow-sm"
                                 ref="matrixContainer"
                                 @mousedown="isMatrixDragging = true; $event.preventDefault(); updateMatrixFromMouse($event)">
                                <canvas ref="matrixCanvasFn" class="w-full h-full block"></canvas>
                                <!-- Cursor -->
                                <div class="absolute w-3 h-3 rounded-full border-2 border-white shadow-sm ring-1 ring-black/20 pointer-events-none -translate-x-1/2 -translate-y-1/2"
                                     :style="{
                                         left: `${currentSat}%`,
                                         top: `${100 - currentVal}%`,
                                         backgroundColor: currentHex
                                     }"></div>
                            </div>

                            <!-- Hue Strip -->
                            <div class="w-8 relative rounded-lg border border-slate-300 dark:border-slate-600 overflow-hidden cursor-ns-resize"
                                 ref="hueContainer"
                                 @mousedown="isHueDragging = true; $event.preventDefault(); updateHueFromMouse($event)"
                                 style="background: linear-gradient(to bottom, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)">
                                 <!-- Thumb -->
                                 <div class="absolute left-0 right-0 h-1.5 bg-white border border-slate-400 rounded-sm shadow-sm pointer-events-none -translate-y-1/2"
                                      :style="{ top: `${(currentHue / 360) * 100}%` }"></div>
                            </div>
                        </div>

                        <!-- Data Inputs & Preview -->
                        <div class="flex gap-4">
                            <div class="w-20 h-20 rounded-xl shadow-lg border border-slate-200 dark:border-slate-600 shrink-0" 
                                 :style="{backgroundColor: currentHex}"></div>
                            
                            <div class="flex-1 space-y-4">
                                <div class="flex items-center gap-2">
                                    <span class="text-2xl font-mono font-medium text-slate-700 dark:text-slate-200">#</span>
                                    <input v-model="currentHex" @input="(e) => updateColorFromHex((e.target as HTMLInputElement).value)" class="text-3xl font-mono font-medium bg-transparent border-b border-slate-300 dark:border-slate-600 w-full focus:outline-none focus:border-indigo-500 uppercase" maxlength="7" />
                                </div>
                                <div class="flex gap-2 text-xs font-mono">
                                    <div class="flex-1 bg-slate-50 dark:bg-slate-900 rounded px-2 py-1 border border-slate-200 dark:border-slate-700">
                                        <label class="block text-[8px] font-bold text-slate-400">R</label>
                                        <input v-model.number="currentRgb.r" @input="updateColorFromRgb" class="w-full bg-transparent border-none p-0 focus:ring-0" type="number" min="0" max="255"/>
                                    </div>
                                    <div class="flex-1 bg-slate-50 dark:bg-slate-900 rounded px-2 py-1 border border-slate-200 dark:border-slate-700">
                                        <label class="block text-[8px] font-bold text-slate-400">G</label>
                                        <input v-model.number="currentRgb.g" @input="updateColorFromRgb" class="w-full bg-transparent border-none p-0 focus:ring-0" type="number" min="0" max="255"/>
                                    </div>
                                    <div class="flex-1 bg-slate-50 dark:bg-slate-900 rounded px-2 py-1 border border-slate-200 dark:border-slate-700">
                                        <label class="block text-[8px] font-bold text-slate-400">B</label>
                                        <input v-model.number="currentRgb.b" @input="updateColorFromRgb" class="w-full bg-transparent border-none p-0 focus:ring-0" type="number" min="0" max="255"/>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="pt-4 border-t border-slate-200 dark:border-slate-700">
                            <label class="text-[10px] uppercase font-bold text-slate-400 block mb-2">Metadata</label>
                            <BaseInput v-if="palette[selectedIndex]" label="Name" v-model="palette[selectedIndex]!.name" @change="updateModel" class="mb-3" />
                            <BaseInput v-if="palette[selectedIndex]" label="ID" v-model="palette[selectedIndex]!.id" mono />
                        </div>
                    </div>
                </div>

                <!-- GENERATE -->
                <div v-if="activeTab === 'generate'" class="space-y-6">
                    <div class="space-y-3">
                        <label class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Strategy</label>
                        <select v-model="genStrategy" @change="generatePreview" class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none">
                            <option value="scale">Material Scale (100-900)</option>
                            <option value="pastel">Pastel Variations</option>
                            <option value="shades">Deep Shades</option>
                            <option value="interpolate">Range Interpolation</option>
                        </select>
                    </div>

                    <div v-if="selectedIndex !== -1 && palette[selectedIndex]" class="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center gap-3">
                         <div class="w-10 h-10 rounded shadow-sm" :style="{backgroundColor: palette[selectedIndex]?.hex}"></div>
                         <div>
                             <span class="text-[10px] uppercase font-bold text-slate-400">Base Color</span>
                             <div class="text-xs font-bold">{{ palette[selectedIndex]?.name }}</div>
                         </div>
                    </div>

                    <div v-if="genStrategy === 'interpolate'" class="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
                        <div class="flex items-center gap-4">
                            <input type="color" v-model="interStart" @input="generatePreview" class="h-8 w-8 rounded cursor-pointer border-none p-0" />
                            <ArrowRight class="w-4 h-4 text-slate-400" />
                            <input type="color" v-model="interEnd" @input="generatePreview" class="h-8 w-8 rounded cursor-pointer border-none p-0" />
                        </div>
                        <div>
                            <div class="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                                <span>Steps</span> <span>{{ interSteps }}</span>
                            </div>
                            <input type="range" v-model.number="interSteps" min="3" max="12" @input="generatePreview" class="w-full accent-indigo-500" />
                        </div>
                    </div>

                    <div v-if="selectedIndex === -1 && genStrategy !== 'interpolate'" class="text-center py-8 text-slate-400 text-xs italic">
                        Select a base color in the grid to generate variations.
                    </div>

                    <div v-else class="space-y-4">
                        <div class="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                            <span>Preview</span>
                        </div>
                        <div class="space-y-2">
                            <div v-for="(g, i) in genColors" :key="i" class="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700">
                                <div class="w-8 h-8 rounded shadow-sm" :style="{backgroundColor: g.hex}"></div>
                                <div class="flex-1">
                                    <div class="text-xs font-bold">{{ g.name }}</div>
                                    <div class="text-[10px] font-mono text-slate-400">{{ g.hex }}</div>
                                </div>
                            </div>
                        </div>
                        <BaseButton class="w-full" @click="commitGenerated"><Wand2 class="w-4 h-4 mr-2" /> Add Colors</BaseButton>
                    </div>
                </div>

                <!-- IMPORT -->
                <div v-if="activeTab === 'import'" class="space-y-6">
                    <p class="text-xs text-slate-500">Paste text containing hex codes (e.g. from Coolors, Figma, CSS).</p>
                    <textarea v-model="importContent" class="w-full h-48 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 font-mono text-xs focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none" placeholder="#FF0000&#10;#00FF00&#10;..."></textarea>
                    <BaseButton class="w-full" @click="processPaste">Import Found Colors</BaseButton>
                    
                    <div class="pt-6 border-t border-slate-200 dark:border-slate-700 space-y-3">
                        <label class="text-[10px] uppercase font-bold text-slate-400">External Tools</label>
                        <div class="grid grid-cols-1 gap-2">
                             <a href="https://coolors.co/" target="_blank" class="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition-colors text-xs font-bold text-slate-600 dark:text-slate-300">
                                  Coolors.co <ExternalLink class="w-3 h-3" />
                             </a>
                             <a href="https://color.adobe.com/create/color-wheel" target="_blank" class="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition-colors text-xs font-bold text-slate-600 dark:text-slate-300">
                                  Adobe Color <ExternalLink class="w-3 h-3" />
                             </a>
                             <a href="https://colorhunt.co/" target="_blank" class="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition-colors text-xs font-bold text-slate-600 dark:text-slate-300">
                                  Color Hunt <ExternalLink class="w-3 h-3" />
                             </a>
                        </div>
                    </div>
                </div>

                <!-- SCRIPT -->
                <div v-if="activeTab === 'script'" class="h-full flex flex-col">
                    <div class="px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-col gap-4">
                        <div class="flex justify-between items-center">
                             <span class="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                <FileCode class="w-4 h-4" /> Generated Script
                             </span>
                             <button @click="copyScript" class="text-indigo-500 hover:text-indigo-400 text-xs font-bold flex items-center gap-1"><Copy class="w-3 h-3" /> Copy</button>
                        </div>
                        <BaseInput label="Context Folder" v-model="rootParentId" class="w-full" />
                    </div>
                    <textarea readonly :value="scriptOutput" class="flex-1 w-full bg-slate-50 dark:bg-[#0d1117] p-4 font-mono text-[10px] text-emerald-600 dark:text-emerald-400 resize-none outline-none leading-relaxed"></textarea>
                </div>
            </div>
        </div>
    </div>
</template>
